import { log } from '@graphprotocol/graph-ts'
import { ApplicationSubmitted, ApplicationUpdated, MilestoneUpdated } from '../generated/QBApplicationsContract/QBApplicationsContract'
import { ApplicationMilestone, Grant, GrantApplication } from '../generated/schema'
import { addApplicationRevision } from './utils/add-application-revision'
import { applicationFromApplicationCreateIpfs } from './utils/application-from-application-create-ipfs'
import { applyApplicationUpdateIpfs } from './utils/apply-application-update-ipfs'
import { applyMilestoneUpdateIpfs } from './utils/apply-milestone-update-ipfs'
import { isPlausibleIPFSHash } from './utils/generics'
import { addApplicationUpdateNotification, addMilestoneUpdateNotification } from './utils/notifications'

export function handleApplicationSubmitted(event: ApplicationSubmitted): void {
	const applicationId = event.params.applicationId.toHex()
	const milestoneCount = event.params.milestoneCount.toI32()
	const grantId = event.params.grant.toHex()

	const grant = Grant.load(grantId)
	if(grant) {
		const entityResult = applicationFromApplicationCreateIpfs(applicationId, event.params.metadataHash)
		if(entityResult.value) {
			const entity = entityResult.value!
			if(entity.milestones.length !== milestoneCount) {
				log.warning(`[${event.transaction.hash.toHex()}] metadata has ${entity.milestones.length} milestones, but contract specifies ${milestoneCount}, ID=${applicationId}`, [])
				return
			}
	
			entity.createdAtS = event.params.time.toI32()
			entity.updatedAtS = entity.createdAtS
			entity.applicantId = event.params.owner
			entity.grant = grantId
			entity.state = "submitted"

			grant.numberOfApplications += 1
	
			entity.save()

			grant.save()
	
			addApplicationRevision(entity, event.transaction.from)
			addApplicationUpdateNotification(entity, event.transaction.hash.toHex(), event.params.owner)
		} else {
			log.warning(`[${event.transaction.hash.toHex()}] error in mapping entity: "${entityResult.error!}"`, [])
		}
	} else {
		log.warning(`[${event.transaction.hash.toHex()}] grant (${grantId}) not found for application submit (${applicationId})`, [])
	}
}

export function handleApplicationUpdated(event: ApplicationUpdated): void {
	const applicationId = event.params.applicationId.toHex()
	const metaHash = event.params.metadataHash
	const milestoneCount = event.params.milestoneCount.toI32()

	const entity = GrantApplication.load(applicationId)
	if(entity) {
		entity.updatedAtS = event.params.time.toI32()
		switch(event.params.state) {
			case 0:
				entity.state = 'submitted'
			break
			case 1:
				entity.state = 'resubmit'
			break
			case 2:
				entity.state = 'approved'
			break
			case 3:
				entity.state = 'rejected'
			break
			case 4:
				entity.state = 'completed'
			break
		}
		// some valid IPFS hash
		if(isPlausibleIPFSHash(metaHash)) {
			const updateResult = applyApplicationUpdateIpfs(entity, event.params.metadataHash)
			if(updateResult.error) {
				log.warning(`[${event.transaction.hash.toHex()}] invalid metadata update for application: ID="${applicationId}", error=${updateResult.error!}`, [])
				return
			}
	
			if(entity.milestones.length !== milestoneCount && milestoneCount > 0) {
				log.warning(`[${event.transaction.hash.toHex()}] metadata update has ${entity.milestones.length} milestones, but contract specifies ${milestoneCount}, ID=${applicationId}`, [])
				return
			}
		}

		entity.save()

		addApplicationRevision(entity, event.transaction.from)
		addApplicationUpdateNotification(entity, event.transaction.hash.toHex(), event.transaction.from)
	} else {
		log.warning(`[${event.transaction.hash.toHex()}] recv update for unknown application: ID="${applicationId}"`, [])
	}
}

export function handleMilestoneUpdated(event: MilestoneUpdated): void {
	const applicationId = event.params._id.toHex()
	const milestoneId = `${applicationId}.${event.params._milestoneId.toI32()}.milestone`

	const entity = ApplicationMilestone.load(milestoneId)
	if(entity) {
		entity.updatedAtS = event.params.time.toI32()
		const stateNum = event.params._state
		switch(stateNum) {
			case 0:
				entity.state = "submitted"
			break
			case 1:
				entity.state = "requested"
			break
			case 2:
				entity.state = "approved"
			break
		}

		if(isPlausibleIPFSHash(event.params._metadataHash)) {
			const result = applyMilestoneUpdateIpfs(entity, event.params._metadataHash)
			if(result.error) {
				log.warning(`[${event.transaction.hash.toHex()}] failed to update milestone from IPFS, ID="${milestoneId}" error=${result.error!}`, [])
				return
			}
		}

		entity.save()

		addMilestoneUpdateNotification(entity, applicationId, event.transaction.hash.toHex(), event.transaction.from)
	} else {
		log.warning(`[${event.transaction.hash.toHex()}] recv milestone updated for unknown application: ID="${milestoneId}"`, [])
	}
}