import { log } from '@graphprotocol/graph-ts'
import { ApplicationMigrate, ApplicationSubmitted, ApplicationUpdated, MilestoneUpdated } from '../generated/QBApplicationsContract/QBApplicationsContract'
import { ApplicationMilestone, Grant, GrantApplication, Migration, Workspace } from '../generated/schema'
import { validatedJsonFromIpfs } from './json-schema/json'
import { addApplicationRevision } from './utils/add-application-revision'
import { contractApplicationStateToString, contractMilestoneStateToString, isPlausibleIPFSHash, mapGrantFieldAnswers, mapGrantPII, mapMilestones, removeEntityCollection } from './utils/generics'
import { addApplicationUpdateNotification, addMilestoneUpdateNotification } from './utils/notifications'
import { ApplicationMilestoneUpdate, GrantApplicationRequest, GrantApplicationUpdate, validateApplicationMilestoneUpdate, validateGrantApplicationRequest, validateGrantApplicationUpdate } from './json-schema'

export function handleApplicationSubmitted(event: ApplicationSubmitted): void {
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

	if(json.pii) {
		entity.pii = mapGrantPII(applicationId, grantId, json.pii!)
	} else {
		entity.pii = []
	}

	entity.save()

	// increment number of applications recv for grant & workspace
	grant.numberOfApplications += 1
	grant.save()

	workspace.numberOfApplications += 1
	workspace.save()

	addApplicationRevision(entity, event.transaction.from)
	addApplicationUpdateNotification(entity, event.transaction.hash.toHex(), event.params.owner)
}

export function handleApplicationUpdated(event: ApplicationUpdated): void {
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

		if(json.feedback) {
			// when state moves to resubmit or reject -- that's when DAO adds feedback
			if(entity.state == 'resubmit' || entity.state == 'rejected') {
				entity.feedbackDao = json.feedback!
			} else if(entity.state == 'submitted') { // when dev moves app to submitted
				entity.feedbackDev = json.feedback!
			}
		}

		entity.version += 1
	}

	// increment number of applicants selected for workspace
	if(previousState == 'submitted' && (strStateResult.value == 'approved' || strStateResult.value == 'completed')) {
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

		workspace.numberOfApplicationsSelected += 1
		workspace.save()
	}

	entity.save()

	addApplicationRevision(entity, event.transaction.from)
	addApplicationUpdateNotification(entity, event.transaction.hash.toHex(), event.transaction.from)
}

export function handleMilestoneUpdated(event: MilestoneUpdated): void {
	const applicationId = event.params._id.toHex()
	const milestoneId = `${applicationId}.${event.params._milestoneId.toI32()}`

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
	const applicationId = event.params.applicationId.toHex()
	const entity = GrantApplication.load(applicationId)
	if(!entity) {
		log.warning(`[${event.transaction.hash.toHex()}] recv migrate for unknown application: ID="${applicationId}"`, [])
		return
	}

	const fromWallet = entity.applicantId
	entity.applicantId = event.params.newApplicantAddress
	entity.save()

	const migration = new Migration(`${applicationId}.${fromWallet}.${event.params.newApplicantAddress}`)
	migration.fromWallet = fromWallet
	migration.toWallet = event.params.newApplicantAddress
	migration.application = applicationId
	migration.type = 'Application'
	migration.transactionHash = event.transaction.hash.toHex()
	migration.timestamp = event.params.time.toI32()
	migration.save()
}