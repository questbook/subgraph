import { BigInt, log, store } from '@graphprotocol/graph-ts'
import {
	DisburseRewardFromSafe,
	FundsTransferStatusUpdated,
	QBAdminsUpdated,
	WorkspaceCreated,
	WorkspaceMemberMigrate,
	WorkspaceMembersUpdated,
	WorkspaceMemberUpdated,
	WorkspaceSafeUpdated,
	WorkspacesVisibleUpdated,
	WorkspaceUpdated
} from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import { FundsTransfer, Grant, GrantApplication, QBAdmin, Workspace, WorkspaceMember, WorkspaceSafe } from '../generated/schema'
import { DisburseReward } from '../generated/templates/QBGrantsContract/QBGrantsContract'
import { validatedJsonFromIpfs } from './json-schema/json'
import {
	mapWorkspaceMembersUpdate,
	mapWorkspacePartners,
	mapWorkspaceSocials,
	mapWorkspaceSupportedNetworks,
	mapWorkspaceTokens
} from './utils/generics'
import { disburseReward } from './utils/handle-disburse-reward'
import {
	validateWorkspaceCreateRequest,
	validateWorkspaceUpdateRequest,
	WorkspaceCreateRequest,
	WorkspaceUpdateRequest
} from './json-schema'

export function handleWorkspaceCreated(event: WorkspaceCreated): void {
	const entityId = event.params.id.toHex()

	const jsonResult = validatedJsonFromIpfs<WorkspaceCreateRequest>(event.params.metadataHash, validateWorkspaceCreateRequest)
	if(jsonResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping workspace create: "${jsonResult.error!}"`, [])
		return
	}

	const json = jsonResult.value!

	const entity = new Workspace(entityId)
	entity.ownerId = event.params.owner
	entity.title = json.title
	entity.about = json.about
	if(json.bio) {
		entity.bio = json.bio!
	}

	entity.logoIpfsHash = json.logoIpfsHash
	entity.coverImageIpfsHash = json.coverImageIpfsHash
	if(json.partners) {
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
	entity.totalGrantFundingCommittedUSD = 0
	entity.numberOfApplications = 0
	entity.numberOfApplicationsSelected = 0
	entity.totalGrantFundingDisbursedUSD = 0

	const member = new WorkspaceMember(`${entityId}.${event.params.owner.toHex()}`)
	member.actorId = event.params.owner
	member.accessLevel = 'owner'
	member.workspace = entity.id
	member.publicKey = json.creatorPublicKey
	member.addedAt = entity.createdAtS
	member.updatedAt = entity.updatedAtS
	member.outstandingReviewIds = []
	member.lastReviewSubmittedAt = 0
	member.addedBy = member.id
	member.lastKnownTxHash = event.transaction.hash

	member.save()
	entity.save()
}

export function handleWorkspaceUpdated(event: WorkspaceUpdated): void {
	const entityId = event.params.id.toHex()

	const entity = Workspace.load(entityId)
	if(!entity) {
		log.warning(`recv workspace update without workspace existing, ID = ${entityId}`, [])
		return
	}

	entity.updatedAtS = event.params.time.toI32()

	const jsonResult = validatedJsonFromIpfs<WorkspaceUpdateRequest>(event.params.metadataHash, validateWorkspaceUpdateRequest)
	if(jsonResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping workspace update: "${jsonResult.error!}"`, [])
		return
	}

	const json = jsonResult.value!
	if(json.title) {
		entity.title = json.title!
	}

	if(json.about) {
		entity.about = json.about!
	}

	if(json.bio) {
		entity.bio = json.bio!
	}

	if(json.logoIpfsHash) {
		entity.logoIpfsHash = json.logoIpfsHash!
	}

	if(json.coverImageIpfsHash) {
		entity.coverImageIpfsHash = json.coverImageIpfsHash
	}

	if(json.partners) {
		entity.partners = mapWorkspacePartners(entityId, json.partners!)
	}

	if(json.socials) {
		entity.socials = mapWorkspaceSocials(entityId, json.socials!)
	}

	if(json.tokens) {
		mapWorkspaceTokens(entity.id, json.tokens!)
	}

	if(json.publicKey) {
		const memberId = event.transaction.from.toHex()
		const mem = WorkspaceMember.load(`${entityId}.${memberId}`)
		if(mem) {
			mem.publicKey = json.publicKey
			mem.updatedAt = entity.updatedAtS
			mem.save()
		} else {
			log.warning(`[${event.transaction.hash.toHex()}] recv publicKey update but member not found`, [])
		}
	}

	entity.save()
}

export function handleWorkspaceSafeUpdated(event: WorkspaceSafeUpdated): void {
	const entityId = event.params.id.toHex()
	if(event.params.safeChainId.gt(new BigInt(0))) {
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
	if(result.error) {
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
	if(result.error) {
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
		_txnHash: ''
	})
}

export function handleDisburseRewardFromSafe(event: DisburseRewardFromSafe): void {
	const depositType = 'funds_disbursed_from_safe'
	const applicationIds = event.params.applicationIds
	const milestoneIds = event.params.milestoneIds
	const asset = event.params.asset
	const nonEvmAsset = event.params.nonEvmAssetAddress
	const txnHash = event.params.transactionHash
	const sender = event.params.sender
	const amounts = event.params.amounts
	const isP2P = event.params.isP2P

	for(let i = 0; i < applicationIds.length; i++) {
		disburseReward({
			event,
			depositType,
			_applicationId: applicationIds[i].toHexString(),
			_milestoneId: milestoneIds[i].toI32(),
			_asset: asset,
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
	const workspaceMemberId = `${workspaceId}.${fromWallet.toHex()}`

	const workspace = Workspace.load(workspaceId)
	if(!workspace) {
		log.warning(`[${event.transaction.hash.toHex()}] workspace not found for member migrate`, [])
		return
	}

	const member = WorkspaceMember.load(workspaceMemberId)
	if(!member) {
		log.warning(`[${event.transaction.hash.toHex()}] member not found for migrate`, [])
		return
	}

	if(workspace.ownerId.toHex() == fromWallet.toHex()) {
		workspace.ownerId = toWallet
		workspace.save()
	}

	store.remove('WorkspaceMember', member.id)
	member.id = `${event.params.workspaceId.toHex()}.${toWallet.toHex()}`
	member.actorId = toWallet

	member.save()
}

export function handleWorkspacesVisibleUpdated(event: WorkspacesVisibleUpdated): void {
	const workspaceIds = event.params.workspaceId
	const isVisibleArr = event.params.isVisible

	for(let idx = 0; idx < workspaceIds.length; idx++) {
		const workspaceId = workspaceIds[idx].toHex()

		const workspace = Workspace.load(workspaceId)
		if(!workspace) {
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

	for(let i = 0; i < walletAddresses.length; i++) {
		const walletAddress = walletAddresses[i].toHex()

		const adminExists = QBAdmin.load(walletAddress)

		if(isAdded) {
			if(adminExists) {
				log.warning(`Admin ${walletAddress} already exists!`, [])
				return
			}

			const entity = new QBAdmin(walletAddress)
			entity.walletAddress = walletAddresses[i]
			entity.addedAt = event.params.time.toI32()

			entity.save()
		} else {
			if(!adminExists) {
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
	const tokenNames = event.params.tokenName
	const tokenUSDValues = event.params.tokenUSDValue
	const executionTimestamps = event.params.executionTimestamp

	for(let i = 0; i < safeTxnHashes.length; i++) {
		const fundsTransferEntity = FundsTransfer.load(`${safeTxnHashes[i]}.${applicationIds[i].toHexString()}`)
		if(!fundsTransferEntity) {
			log.warning(`[${event.transaction.hash.toHex()}] funds transfer not found for status update`, [])
			return
		}

		fundsTransferEntity.status = statuses[i]
		fundsTransferEntity.tokenName = tokenNames[i]
		fundsTransferEntity.tokenUSDValue = tokenUSDValues[i]
		fundsTransferEntity.executionTimestamp = executionTimestamps[i].toI32()

		log.info(`[${event.params.transactionHash}] Funds transfer status updated with ${statuses[i]} for token - ${tokenNames[i]} }`, [])

		const applicationEntity = GrantApplication.load(applicationIds[i].toHexString())
		log.info(`[${event.params.transactionHash}] Application entity found for ${applicationIds[i].toHexString()}}`, [])
		const grantEntity = Grant.load(applicationEntity!.grant!)

		if(grantEntity) {
			const workspace = Workspace.load(grantEntity.workspace)
			if(workspace && fundsTransferEntity.type == 'funds_disbursed_from_safe') {
				workspace.totalGrantFundingDisbursedUSD = workspace.totalGrantFundingDisbursedUSD += tokenUSDValues[i].toI32()
				workspace.save()
			}
		} else {
			log.warning(`[${event.params.transactionHash}] Grant not found for status update`, [])
		}

		fundsTransferEntity.save()

	}
}
