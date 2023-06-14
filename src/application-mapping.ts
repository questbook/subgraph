import { Bytes, log } from '@graphprotocol/graph-ts'
import { ApplicationMigrate, ApplicationSubmitted, ApplicationUpdated, MilestoneUpdated, WalletAddressUpdated } from '../generated/QBApplicationsContract/QBApplicationsContract'
import { ApplicationAction, ApplicationMilestone, Claim, Grant, GrantApplication, Migration, Workspace } from '../generated/schema'
import { validatedJsonFromIpfs } from './json-schema/json'
import { addApplicationRevision } from './utils/add-application-revision'
import { contractApplicationStateToString, contractMilestoneStateToString, isPlausibleIPFSHash, mapClaims, mapGrantFieldAnswers, mapGrantPII, mapMilestones, removeEntityCollection } from './utils/generics'
import { addApplicationUpdateNotification, addMilestoneUpdateNotification } from './utils/notifications'
import { ApplicationMilestoneUpdate, GrantApplicationRequest, GrantApplicationUpdate, GrantProposedClaim, validateApplicationMilestoneUpdate, validateGrantApplicationRequest, validateGrantApplicationUpdate } from './json-schema'

export function handleApplicationSubmitted(event: ApplicationSubmitted): void {
	const e = new Claim(event.params.metadataHash)
	e.link='handleApplicationSubmitted'
	e.title='df'
	e.save()
	return
	const applicationId = event.params.applicationId.toHex()
	const milestoneCount = event.params.milestoneCount.toI32()
	const grantId = event.params.grant.toHex()
	
	const grant = Grant.load(grantId)
	if(!grant) {
		log.warning(`[${event.transaction.hash.toHex()}] grant (${grantId}) not found for application submit (${applicationId})`, [])
		return
	}

	const workspace = Workspace.load(grant.workspace)
	if(!workspace) {
		log.warning(`[${event.transaction.hash.toHex()}] workspace (${grant.workspace}) not found for application submit (${applicationId})`, [])
		return
	}

	const jsonResult = validatedJsonFromIpfs<GrantApplicationRequest>(event.params.metadataHash, validateGrantApplicationRequest)
	if(jsonResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping application: "${jsonResult.error!}"`, [])
		return
	}

	const json = jsonResult.value!
	if(json.milestones.length !== milestoneCount) {
		log.warning(`[${event.transaction.hash.toHex()}] metadata has ${json.milestones.length} milestones, but contract specifies ${milestoneCount}, ID=${applicationId}`, [])
		return
	}

	const entity = new GrantApplication(applicationId)
	entity.grant = grantId
	entity.applicantId = event.params.owner
	entity.applicantPublicKey = json.applicantPublicKey
	entity.state = 'submitted'
	entity.fields = mapGrantFieldAnswers(applicationId, grantId, json.fields)
	entity.createdAtS = event.params.time.toI32()
	entity.updatedAtS = entity.createdAtS
	entity.milestones = mapMilestones(applicationId, json.milestones)
	entity.reviewers = []
	entity.applicationReviewers = []
	entity.version = 1
	entity.doneReviewerAddresses = []
	entity.pendingReviewerAddresses = []
	entity.walletAddress = new Bytes(32)
	if(json.claims) {
		entity.claims = mapClaims(applicationId, json.claims as GrantProposedClaim[])
	} else {
		entity.claims = []
	}
	
	if(json.pii) {
		entity.pii = mapGrantPII(applicationId, grantId, json.pii!)
	} else {
		entity.pii = []
	}

	entity.save()

	// increment number of applications recv for grant & workspace
	grant.numberOfApplications += 1
	grant.numberOfApplicationsPending += 1
	grant.save()

	addApplicationRevision(entity, event.transaction.from)
	addApplicationUpdateNotification(entity, event.transaction.hash.toHex(), event.params.owner)
}

export function handleApplicationUpdated(event: ApplicationUpdated): void {
	const e = new Claim(event.params.metadataHash)
	e.link='handleApplicationUpdated'
	e.title='df'
	e.save()
	return
	const applicationId = event.params.applicationId.toHex()
	const metaHash = event.params.metadataHash
	const milestoneCount = event.params.milestoneCount.toI32()
	
	const strStateResult = contractApplicationStateToString(event.params.state)
	if(strStateResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping app state: "${strStateResult.error!}"`, [])
		return
	}

	const entity = GrantApplication.load(applicationId)
	if(!entity) {
		log.warning(`[${event.transaction.hash.toHex()}] recv update for unknown application: ID="${applicationId}"`, [])
		return
	}

	const grant = Grant.load(entity.grant)

	if(!grant) {
		log.warning(`[${event.transaction.hash.toHex()}] grant (${entity.grant}) not found for application completed (${applicationId})`, [])
		return
	}

	const workspace = Workspace.load(grant.workspace)
	if(!workspace) {
		log.warning(`[${event.transaction.hash.toHex()}] workspace (${grant.workspace}) not found for application completed (${applicationId})`, [])
		return
	}

	const actionEntity = new ApplicationAction(`${applicationId}.${event.params.owner.toHex()}.${entity.version}`)
	log.info(`entity version ${actionEntity.id}`, [])
	actionEntity.application = applicationId
	actionEntity.updatedAtS = event.params.time.toI32()
	actionEntity.updatedBy = event.params.owner
	actionEntity.state = strStateResult.value!

	entity.updatedAtS = event.params.time.toI32()
	const previousState = entity.state
	entity.state = strStateResult.value!
	// some valid IPFS hash
	if(isPlausibleIPFSHash(metaHash)) {
		const jsonResult = validatedJsonFromIpfs<GrantApplicationUpdate>(event.params.metadataHash, validateGrantApplicationUpdate)
		if(jsonResult.error) {
			log.warning(`[${event.transaction.hash.toHex()}] error in mapping application update: "${jsonResult.error!}"`, [])
			return
		}

		const json = jsonResult.value!
		if(json.milestones && (json.milestones!.length !== milestoneCount) && milestoneCount > 0) {
			log.warning(`[${event.transaction.hash.toHex()}] metadata update has ${json.milestones!.length} milestones, but contract specifies ${milestoneCount}, ID=${applicationId}`, [])
			return
		}

		if(json.fields) {
			entity.fields = mapGrantFieldAnswers(entity.id, entity.grant, json.fields!)
		}

		if(json.pii) {
			removeEntityCollection('PIIAnswer', entity.pii)
			entity.pii = mapGrantPII(entity.id, entity.grant, json.pii!)
		}

		if(json.milestones) {
			entity.milestones = mapMilestones(entity.id, json.milestones!)
		}

		if(json.claims) {
			entity.claims = mapClaims(entity.id, json.claims!)
		}

		if(json.feedback) {
			// when state moves to resubmit or reject -- that's when DAO adds feedback
			if(entity.state == 'resubmit' || entity.state == 'rejected') {
				entity.feedbackDao = json.feedback!
			} else if(entity.state == 'submitted') { // when dev moves app to submitted
				entity.feedbackDev = json.feedback!
			}
		}

		if(json.applicantPublicKey) {
			entity.applicantPublicKey = json.applicantPublicKey
		}

		if(json.feedback) {
			actionEntity.feedback = json.feedback
		}
	}

	actionEntity.save()

	// increment number of applicants selected for workspace
	// if(previousState == 'submitted' && (strStateResult.value == 'approved' || strStateResult.value == 'completed')) {
	// 	entity.numberOfApplicationsSelected += 1
	// 	workspace.save()
	// } else if (previousState == 'approved' && strStateResult.value != 'completed') {
	// 	workspace.numberOfApplicationsSelected -= 1
	// 	workspace.save()
	// }

	if(previousState == 'submitted') {
		grant.numberOfApplicationsPending -= 1
	} else if(previousState == 'approved') {
		grant.numberOfApplicationsSelected -= 1
	} else if(previousState == 'rejected') {
		grant.numberOfApplicationsRejected -= 1
	} else if(previousState == 'resubmit') {
		grant.numberOfApplicationsAwaitingResubmission -= 1
	}

	if(strStateResult.value == 'submitted') {
		grant.numberOfApplicationsPending += 1
	} else if(strStateResult.value == 'approved') {
		grant.numberOfApplicationsSelected += 1
	} else if(strStateResult.value == 'rejected') {
		grant.numberOfApplicationsRejected += 1
	} else if(strStateResult.value == 'resubmit') {
		grant.numberOfApplicationsAwaitingResubmission += 1
	}

	grant.save()

	entity.version += 1
	entity.save()

	addApplicationRevision(entity, event.transaction.from)
	addApplicationUpdateNotification(entity, event.transaction.hash.toHex(), event.transaction.from)
}

export function handleMilestoneUpdated(event: MilestoneUpdated): void {
	const applicationId = event.params._id.toHex()
	const milestoneId = `${applicationId}.${event.params._milestoneId.toI32()}`
	const e = new Claim(event.params._metadataHash)
	e.link='handleMilestoneUpdated'
	e.title='df'
	e.save()
	return
	const strStateResult = contractMilestoneStateToString(event.params._state)
	if(strStateResult.error) {
		log.warning(`[${event.transaction.hash.toHex()}] error in mapping milestone state: "${strStateResult.error!}"`, [])
		return
	}

	const entity = ApplicationMilestone.load(milestoneId)
	if(!entity) {
		log.warning(`[${event.transaction.hash.toHex()}] recv milestone updated for unknown milestone: ID="${milestoneId}"`, [])
		return
	}

	entity.updatedAtS = event.params.time.toI32()
	entity.state = strStateResult.value!

	if(isPlausibleIPFSHash(event.params._metadataHash)) {
		const jsonResult = validatedJsonFromIpfs<ApplicationMilestoneUpdate>(event.params._metadataHash, validateApplicationMilestoneUpdate)
		if(jsonResult.error) {
			log.warning(`[${event.transaction.hash.toHex()}] failed to update milestone from IPFS, ID="${milestoneId}" error=${jsonResult.error!}`, [])
			return
		}

		const json = jsonResult.value!
		if(entity.state == 'requested') {
			entity.feedbackDev = json.text
			entity.feedbackDevUpdatedAtS = event.params.time.toI32()
		} else if(entity.state == 'approved' || entity.state == 'submitted') {
			entity.feedbackDao = json.text
			entity.feedbackDaoUpdatedAtS = event.params.time.toI32()
		}

	}

	entity.save()

	addMilestoneUpdateNotification(entity, applicationId, event.transaction.hash.toHex(), event.transaction.from)
}

export function handleApplicationMigrate(event: ApplicationMigrate): void {
	return
	const applicationId = event.params.applicationId.toHex()
	const entity = GrantApplication.load(applicationId)
	if(!entity) {
		log.warning(`[${event.transaction.hash.toHex()}] recv migrate for unknown application: ID="${applicationId}"`, [])
		return
	}
	const fromWallet = entity.applicantId
	entity.applicantId = event.params.newApplicantAddress
	entity.save()

	const migration = new Migration(`${applicationId}.${fromWallet.toHexString()}.${event.params.newApplicantAddress.toHexString()}`)
	migration.fromWallet = fromWallet
	migration.toWallet = event.params.newApplicantAddress
	migration.application = applicationId
	migration.type = 'Application'
	migration.transactionHash = event.transaction.hash.toHex()
	migration.timestamp = event.params.time.toI32()
	migration.save()
}

export function handleWalletAddressUpdated(event: WalletAddressUpdated): void {
	return
	const applicationId = event.params.applicationId.toHex()
	const grantAddress = event.params.grant
	const walletAddress = event.params.walletAddress
	const time = event.params.time.toI32()
	
	const app = GrantApplication.load(applicationId)
	if(!app) {
		log.warning(`[${event.transaction.hash.toHex()}] recv wallet address update for unknown application: ID="${applicationId}"`, [])
		return
	}

	if(app.grant != grantAddress.toHexString()) {
		log.warning(`[${event.transaction.hash.toHex()}] recv wallet address update for application with wrong grant: ID="${applicationId} [${app.grant} and ${grantAddress.toHexString()}]"`, [])
		return
	}

	app.walletAddress = walletAddress
	app.updatedAtS = time
	app.save()
}