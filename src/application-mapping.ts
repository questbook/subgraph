import { log } from '@graphprotocol/graph-ts'
import { ApplicationSubmitted, ApplicationUpdated, MilestoneUpdated } from '../generated/QBApplicationsContract/QBApplicationsContract'
import { ApplicationMilestone } from '../generated/schema'
import { applicationFromApplicationCreateIpfs } from './utils/application-from-application-create-ipfs'
import { applyMilestoneUpdateIpfs } from './utils/apply-milestone-update-ipfs'

export function handleApplicationSubmitted(event: ApplicationSubmitted): void {
	const applicationId = event.params.applicationId.toHex()

	const entityResult = applicationFromApplicationCreateIpfs(applicationId, event.params.metadataHash)
	if(entityResult.value) {
		const entity = entityResult.value!
		entity.createdAtS = event.params.time.toI32()
		entity.updatedAtS = entity.createdAtS
		entity.applicantId = event.params.owner
		entity.grant = event.params.grant.toHex()
		entity.state = "submitted"

		entity.save()
	} else {
		log.warning(`error in mapping entity: "${entityResult.error!}"`, [])
	}
}

export function handleApplicationUpdated(event: ApplicationUpdated): void {

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

		if(event.params._metadataHash.length) {
			const result = applyMilestoneUpdateIpfs(entity, event.params._metadataHash)
			if(result.error) {
				log.warning(`failed to update milestone from IPFS, ID="${milestoneId}" error=${result.error!}`, [])
				return
			}
		}

		entity.save()
	} else {
		log.warning(`recv milestone updated for unknown application: ID="${milestoneId}"`, [])
	}
}