import { BigInt, log, store } from '@graphprotocol/graph-ts'
import {
	DisburseRewardFromSafe,
	WorkspaceCreated,
	WorkspaceMembersUpdated,
	WorkspaceMemberUpdated,
	WorkspaceSafeUpdated,
	WorkspaceUpdated
} from '../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract'
import { Workspace, WorkspaceMember, WorkspaceSafe } from '../generated/schema'
import { DisburseReward } from '../generated/templates/QBGrantsContract/QBGrantsContract'
import { validatedJsonFromIpfs } from './json-schema/json'
import { mapWorkspaceMembersUpdate, mapWorkspacePartners, mapWorkspaceSocials, mapWorkspaceSupportedNetworks, mapWorkspaceTokens } from './utils/generics'
import { disburseReward } from './utils/handle-disburse-reward'
import { validateWorkspaceCreateRequest, validateWorkspaceUpdateRequest, WorkspaceCreateRequest, WorkspaceUpdateRequest } from './json-schema'

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
		entity.address = event.params.safeAddress

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
		_applicationId: event.params.applicationId.toHex(),
		_milestoneId: event.params.milestoneId.toI32(),
		_sender: event.params.sender,
		_amount: event.params.amount,
		_isP2P: event.params.isP2P
	})
}

export function handleDisburseRewardFromSafe(event: DisburseRewardFromSafe): void {
	disburseReward({
		event, 
		depositType: 'funds_disbursed_from_safe',
		_applicationId: event.params.applicationId.toHex(),
		_milestoneId: event.params.milestoneId.toI32(),
		_sender: event.params.sender,
		_amount: event.params.amount,
		_isP2P: event.params.isP2P
	})
}
