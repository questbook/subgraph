import { BigInt, log, store } from '@graphprotocol/graph-ts'
import {
	DisburseRewardFromSafe,
	DisburseRewardFromSafe1,
	DisburseRewardFromWallet,
	FundsTransferStatusUpdated,
	GrantsSectionUpdated,
	QBAdminsUpdated,
	WorkspaceCreated,
	WorkspaceMemberMigrate,
	WorkspaceMembersUpdated,
	WorkspaceMemberUpdated,
	WorkspaceSafeUpdated,
	WorkspacesVisibleUpdated,
	WorkspaceUpdated
} from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication, Migration, Profile, QBAdmin, Review, Section, Workspace, WorkspaceMember, WorkspaceSafe } from '../generated/schema'
import { DisburseReward } from '../generated/templates/QBGrantsContract/QBGrantsContract'
import { validatedJsonFromIpfs } from './json-schema/json'
import {
	ALLOWED_FUND_TRANSFER_VALUES,
	mapWorkspaceMembersUpdate,
	mapWorkspacePartners,
	mapWorkspaceSocials,
	mapWorkspaceSupportedNetworks,
	mapWorkspaceTokens
} from './utils/generics'
import { disburseReward } from './utils/handle-disburse-reward'
import { migrateGrant, migrateProfile } from './utils/migrations'
import { addFundsTransferNotification } from './utils/notifications'
import {
	validateWorkspaceCreateRequest,
	validateWorkspaceUpdateRequest,
	WorkspaceCreateRequest,
	WorkspaceUpdateRequest
} from './json-schema'

export function handleWorkspaceCreated(event: WorkspaceCreated): void {
	const entityId = event.params.id.toHex()

	const jsonResult = validatedJsonFromIpfs<WorkspaceCreateRequest>(event.params.metadataHash, validateWorkspaceCreateRequest)
	if (jsonResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping workspace create: "${jsonResult.error!}"`, [])
		return
	}

	const json = jsonResult.value!

	const entity = new Workspace(entityId)
	entity.ownerId = event.params.owner
	entity.title = json.title
	entity.about = json.about
	if (json.bio) {
		entity.bio = json.bio!
	}

	entity.logoIpfsHash = json.logoIpfsHash
	entity.coverImageIpfsHash = json.coverImageIpfsHash
	if (json.partners) {
		entity.partners = mapWorkspacePartners(entityId, json.partners!)
	} else {
		entity.partners = []
	}

	entity.supportedNetworks = mapWorkspaceSupportedNetworks(json.supportedNetworks)
	entity.createdAtS = event.params.time.toI32()
	entity.updatedAtS = entity.createdAtS
	entity.socials = mapWorkspaceSocials(entityId, json.socials)
	entity.metadataHash = event.params.metadataHash
	entity.isVisible = true
	entity.mostRecentGrantPostedAtS = 0
	entity.grants = []

	let profile = Profile.load(event.params.owner.toHex())
	const member = new WorkspaceMember(`${entityId}.${event.params.owner.toHex()}`)

	if (!profile) {
		profile = new Profile(event.params.owner.toHex())
		profile.actorId = event.params.owner
		profile.createdAt = entity.createdAtS
		profile.workspaceMembers = [member.id]
	}

	profile.publicKey = json.creatorPublicKey
	profile.updatedAt = entity.updatedAtS

	const members = profile.workspaceMembers
	members.push(member.id)
	profile.workspaceMembers = members

	profile.applications = []
	profile.reviews = []

	member.accessLevel = 'owner'
	member.workspace = entity.id
	member.addedBy = member.id
	member.addedAt = entity.createdAtS
	member.enabled = true

	profile.save()
	member.save()
	entity.save()
}

export function handleWorkspaceUpdated(event: WorkspaceUpdated): void {
	const entityId = event.params.id.toHex()

	const entity = Workspace.load(entityId)
	if (!entity) {
		log.warning(`recv workspace update without workspace existing, ID = ${entityId}`, [])
		return
	}

	entity.updatedAtS = event.params.time.toI32()

	const jsonResult = validatedJsonFromIpfs<WorkspaceUpdateRequest>(event.params.metadataHash, validateWorkspaceUpdateRequest)
	if (jsonResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping workspace update: "${jsonResult.error!}"`, [])
		return
	}

	const json = jsonResult.value!
	if (json.title) {
		entity.title = json.title!
	}

	if (json.about) {
		entity.about = json.about!
	}

	if (json.bio) {
		entity.bio = json.bio!
	}

	if (json.logoIpfsHash) {
		entity.logoIpfsHash = json.logoIpfsHash!
	}

	if (json.coverImageIpfsHash) {
		entity.coverImageIpfsHash = json.coverImageIpfsHash
	}

	if (json.partners) {
		entity.partners = mapWorkspacePartners(entityId, json.partners!)
	}

	if (json.socials) {
		entity.socials = mapWorkspaceSocials(entityId, json.socials!)
	}

	if (json.tokens) {
		mapWorkspaceTokens(entity.id, json.tokens!)
	}

	if (json.publicKey) {
		const memberId = event.transaction.from.toHex()
		const profile = Profile.load(memberId)
		if (profile) {
			profile.publicKey = json.publicKey
			profile.updatedAt = entity.updatedAtS
			profile.save()
		} else {
			log.warning(`[${event.transaction.hash.toHex()}] recv publicKey update but member not found`, [])
		}
	}

	entity.save()
}

export function handleWorkspaceSafeUpdated(event: WorkspaceSafeUpdated): void {
	const entityId = event.params.id.toHex()
	if (event.params.safeChainId.gt(new BigInt(0))) {
		const entity = new WorkspaceSafe(entityId)
		entity.workspace = entityId
		entity.chainId = event.params.safeChainId
		entity.address = event.params.longSafeAddress

		entity.save()
	} else {
		store.remove('WorkspaceSafe', entityId)
	}
}

export function handleWorkspaceMembersUpdated(event: WorkspaceMembersUpdated): void {
	const result = mapWorkspaceMembersUpdate(
		event.params.id.toHex(),
		event.params.time,
		event.params.members,
		event.params.roles,
		event.params.enabled,
		event.params.emails,
		null,
		event.transaction.from,
		event.transaction.hash
	)
	if (result.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping workspace member update: "${result.error!}"`, [])
	}
}

export function handleWorkspaceMemberUpdated(event: WorkspaceMemberUpdated): void {
	const result = mapWorkspaceMembersUpdate(
		event.params.id.toHex(),
		event.params.time,
		[event.params.member],
		[event.params.role],
		[event.params.enabled],
		null,
		[event.params.metadataHash],
		event.transaction.from,
		event.transaction.hash
	)
	if (result.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping single workspace member update: "${result.error!}"`, [])
	}
}

export function handleDisburseReward(event: DisburseReward): void {
	disburseReward({
		event,
		depositType: 'funds_disbursed',
		_applicationId: event.params.applicationId.toHexString(),
		_milestoneId: event.params.milestoneId.toI32(),
		_sender: event.params.sender,
		_amount: event.params.amount,
		_isP2P: event.params.isP2P,
		_asset: event.params.asset,
		_nonEvmAsset: '',
		_txnHash: '',
		_tokenName: ''
	})
}

export function handleDisburseRewardFromSafe(event: DisburseRewardFromSafe): void {
	const depositType = 'funds_disbursed_from_safe'
	const applicationIds = event.params.applicationIds
	const milestoneIds = event.params.milestoneIds
	const asset = event.params.asset
	// const tokenName = event.params.tokenName
	const nonEvmAsset = event.params.nonEvmAssetAddress
	const txnHash = event.params.transactionHash
	const sender = event.params.sender
	const amounts = event.params.amounts
	const isP2P = event.params.isP2P

	for (let i = 0; i < applicationIds.length; i++) {
		disburseReward({
			event,
			depositType,
			_applicationId: applicationIds[i].toHexString(),
			_milestoneId: milestoneIds[i].toI32(),
			_asset: asset,
			_tokenName: '',
			_nonEvmAsset: nonEvmAsset,
			_txnHash: txnHash,
			_sender: sender,
			_amount: amounts[i],
			_isP2P: isP2P
		})
	}
}

export function handleDisburseRewardFromSafe1(event: DisburseRewardFromSafe1): void {
	const depositType = 'funds_disbursed_from_safe'
	const applicationIds = event.params.applicationIds
	const milestoneIds = event.params.milestoneIds
	const asset = event.params.asset
	const tokenName = event.params.tokenName
	const nonEvmAsset = event.params.nonEvmAssetAddress
	const txnHash = event.params.transactionHash
	const sender = event.params.sender
	const amounts = event.params.amounts
	const isP2P = event.params.isP2P

	for (let i = 0; i < applicationIds.length; i++) {
		disburseReward({
			event,
			depositType,
			_applicationId: applicationIds[i].toHexString(),
			_milestoneId: milestoneIds[i].toI32(),
			_asset: asset,
			_tokenName: tokenName,
			_nonEvmAsset: nonEvmAsset,
			_txnHash: txnHash,
			_sender: sender,
			_amount: amounts[i],
			_isP2P: isP2P
		})
	}
}

export function handleDisburseRewardFromWallet(event: DisburseRewardFromWallet): void {
	const depositType = 'funds_disbursed_from_wallet'
	const applicationIds = event.params.applicationIds
	const milestoneIds = event.params.milestoneIds
	const asset = event.params.asset
	const tokenName = event.params.tokenName
	const nonEvmAsset = event.params.nonEvmAssetAddress
	const txnHash = event.params.transactionHash
	const sender = event.params.sender
	const amounts = event.params.amounts
	const isP2P = event.params.isP2P

	for (let i = 0; i < applicationIds.length; i++) {
		disburseReward({
			event,
			depositType,
			_applicationId: applicationIds[i].toHexString(),
			_milestoneId: milestoneIds[i].toI32(),
			_asset: asset,
			_tokenName: tokenName,
			_nonEvmAsset: nonEvmAsset,
			_txnHash: txnHash,
			_sender: sender,
			_amount: amounts[i],
			_isP2P: isP2P
		})
	}
}

export function handleWorkspaceMemberMigrate(event: WorkspaceMemberMigrate): void {
	const fromWallet = event.params.from
	const toWallet = event.params.to
	const workspaceId = event.params.workspaceId.toHex()

	const workspace = Workspace.load(workspaceId)
	if (!workspace) {
		log.warning(`[${event.transaction.hash.toHex()}] workspace not found for member migrate`, [])
		return
	}

	const profile = Profile.load(fromWallet.toHex());
	if (!profile) {
		log.warning(`[${event.transaction.hash.toHex()}] profile not found for member migrate`, [])
		return
	}

	for (let i = 0; i < workspace.grants.length; ++i) {
		const grantId = workspace.grants[i]
		const grant = Grant.load(grantId)
		if (!grant) {
			log.warning(`[${event.transaction.hash.toHex()}] grant not found for member migrate`, [])
			return
		}

		migrateGrant(grant, fromWallet, toWallet)
	}

	if (workspace.ownerId.toHex() == fromWallet.toHex()) {
		workspace.ownerId = toWallet
		workspace.save()
	}

	store.remove('Profile', profile.id)
	profile.id = toWallet.toHex()
	profile.actorId = toWallet
	profile.save()

	migrateProfile(profile, workspaceId, fromWallet, toWallet)

	const migration = new Migration(`${workspaceId}.${fromWallet.toHexString()}.${toWallet.toHexString()}`)
	migration.fromWallet = fromWallet
	migration.toWallet = toWallet
	migration.workspace = workspaceId
	migration.type = 'WorkspaceMember'
	migration.transactionHash = event.transaction.hash.toHex()
	migration.timestamp = event.params.time.toI32()
	migration.save()
}

export function handleWorkspacesVisibleUpdated(event: WorkspacesVisibleUpdated): void {
	const workspaceIds = event.params.workspaceId
	const isVisibleArr = event.params.isVisible

	for (let idx = 0; idx < workspaceIds.length; idx++) {
		const workspaceId = workspaceIds[idx].toHex()

		const workspace = Workspace.load(workspaceId)
		if (!workspace) {
			log.warning(`workspace [${workspaceId}] not found for visibility update`, [])
			continue
		}

		workspace.isVisible = isVisibleArr[idx]
		workspace.save()
	}
}

export function handleQBAdminsUpdated(event: QBAdminsUpdated): void {
	const walletAddresses = event.params.walletAddresses
	const isAdded = event.params.isAdded

	for (let i = 0; i < walletAddresses.length; i++) {
		const walletAddress = walletAddresses[i].toHex()

		const adminExists = QBAdmin.load(walletAddress)

		if (isAdded) {
			if (adminExists) {
				log.warning(`Admin ${walletAddress} already exists!`, [])
				return
			}

			const entity = new QBAdmin(walletAddress)
			entity.walletAddress = walletAddresses[i]
			entity.addedAt = event.params.time.toI32()

			entity.save()
		} else {
			if (!adminExists) {
				log.warning(`Admin ${walletAddress} does not exist!`, [])
				return
			}

			store.remove('QBAdmin', walletAddress)
		}

	}
}

export function handleFundsTransferStatusUpdated(event: FundsTransferStatusUpdated): void {
	const safeTxnHashes = event.params.transactionHash
	const applicationIds = event.params.applicationId
	const statuses = event.params.status
	const tokenUSDValues = event.params.tokenUSDValue
	const executionTimestamps = event.params.executionTimestamp

	for (let i = 0; i < safeTxnHashes.length; ++i) {
		const safeTxnHash = safeTxnHashes[i]
		const applicationId = applicationIds[i].toString()
		const status = statuses[i]
		const tokenUSDValue = tokenUSDValues[i].toString()

		log.info(`(Funds Transfer Status Update) - Received: ${safeTxnHash}, ${applicationId}, ${status}, ${tokenUSDValue}, ${executionTimestamps[i].toString()}`, [])
	}

	for (let i = 0; i < safeTxnHashes.length; i++) {
		if (executionTimestamps[i].toString().length != 10) {
			log.warning(`(Funds Transfer Status Update) - Invalid execution timestamp: ${executionTimestamps[i].toString()}`, [])
			continue
		}

		const fundsTransferEntity = FundsTransfer.load(`${safeTxnHashes[i]}.${applicationIds[i].toHexString()}`)
		if (!fundsTransferEntity) {
			log.warning(`[${event.transaction.hash.toHex()}] funds transfer not found for status update`, [])
			continue
		}

		if (!ALLOWED_FUND_TRANSFER_VALUES.has(statuses[i])) {
			log.warning(`[${event.transaction.hash.toHex()}] incorrect value for enum ${statuses[i]}`, [])
			continue
		}

		const oldStatus = fundsTransferEntity.status
		fundsTransferEntity.status = statuses[i]
		fundsTransferEntity.tokenUSDValue = tokenUSDValues[i]
		fundsTransferEntity.executionTimestamp = executionTimestamps[i].toI32()

		log.info(`[${event.params.transactionHash}] Funds transfer status updated with ${statuses[i]}}`, [])

		const applicationEntity = GrantApplication.load(applicationIds[i].toHexString())
		if (!applicationEntity) {
			log.warning(`[${event.params.transactionHash}] Application entity not found for ${applicationIds[i].toHexString()}}`, [])
			continue
		}

		log.info(`[${event.params.transactionHash}] Application entity found for ${applicationIds[i].toHexString()}}`, [])

		if (oldStatus == 'queued' && statuses[i] == 'executed' && (fundsTransferEntity.type == 'funds_disbursed_from_safe' || fundsTransferEntity.type == 'funds_disbursed_from_wallet')) {
			// update grant balance
			const grantEntity = Grant.load(applicationEntity.grant)

			if (!grantEntity) {
				log.warning(`[${event.params.transactionHash}] Grant not found for status update`, [])
				continue
			}

			grantEntity.totalGrantFundingDisbursedUSD = grantEntity.totalGrantFundingDisbursedUSD.plus(fundsTransferEntity.amount)


			// update milestone amount paid value
			const milestoneEntity = ApplicationMilestone.load(fundsTransferEntity.milestone!)
			if (!milestoneEntity) {
				log.warning(`[${event.params.transactionHash}] Milestone not found for status update`, [])
				continue
			}

			milestoneEntity.amountPaid = milestoneEntity.amountPaid.plus(fundsTransferEntity.amount)

			grantEntity.save()
			milestoneEntity.save()
		}

		fundsTransferEntity.save()

		addFundsTransferNotification(fundsTransferEntity)
	}
}

export function handleGrantsSectionUpdate(event: GrantsSectionUpdated): void {
	const grantIds = event.params.grantIds
	const sectionName = event.params.sectionName
	const sectionLogoIpfsHash = event.params.sectionLogoIpfsHash

	const grants: string[] = []
	// first check if all grants exist
	for (let i = 0; i < grantIds.length; i++) {
		const grantId = grantIds[i].toHexString()
		const grant = Grant.load(grantId)
		if (!grant) {
			log.warning(`[${event.transaction.hash.toHex()}] Grant not found for section update`, [])
			return
		} else {
			grants.push(grantId)
		}
	}

	const sectionEntity = Section.load(`${sectionName}`)

	// if grantIds is empty, remove the section
	if (grantIds.length == 0) {
		if (sectionEntity) {
			store.remove('Section', `${sectionName}`)
		}

		return
	}

	// if section does not exist, create it
	if (!sectionEntity) {
		const newSectionEntity = new Section(`${sectionName}`)
		newSectionEntity.sectionName = sectionName
		newSectionEntity.sectionLogoIpfsHash = sectionLogoIpfsHash
		newSectionEntity.grants = grants
		newSectionEntity.save()
	} else { // if section exists, update it
		sectionEntity.grants = grants
		if (sectionEntity.sectionLogoIpfsHash) {
			sectionEntity.sectionLogoIpfsHash = sectionLogoIpfsHash
			sectionEntity.save()
		}

		return
	}
}

