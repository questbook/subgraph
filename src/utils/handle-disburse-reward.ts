import { log } from '@graphprotocol/graph-ts'
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication } from '../../generated/schema'
import { DisburseReward } from '../../generated/templates/QBGrantsContract/QBGrantsContract'
import { addFundsTransferNotification } from './notifications'

export function disburseReward(event: DisburseReward): void {
	const applicationId = event.params.applicationId.toHex()
	const milestoneIndex = event.params.milestoneId.toI32()
	const milestoneId = `${applicationId}.${milestoneIndex}`
	const amountPaid = event.params.amount

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${event.transaction.hash.toHex()}] recv disburse reward for unknown application: ID="${applicationId}"`, [])
		return
	}

	const disburseEntity = new FundsTransfer(event.transaction.hash.toHex())
	disburseEntity.createdAtS = event.params.time.toI32()
	disburseEntity.amount = amountPaid
	disburseEntity.sender = event.params.sender
	disburseEntity.to = event.transaction.to!
	disburseEntity.application = applicationId
	disburseEntity.milestone = milestoneId
	disburseEntity.type = 'funds_disbursed'
	disburseEntity.grant = application.grant

	disburseEntity.save()

	const entity = ApplicationMilestone.load(milestoneId)
	if(!entity) {
		log.warning(`[${event.transaction.hash.toHex()}] recv milestone updated for unknown application: ID="${milestoneId}"`, [])
		return
	}

	entity.amountPaid = entity.amountPaid.plus(amountPaid)
	entity.updatedAtS = event.params.time.toI32()
	// find grant and reduce the amount of the funding
	// only if not a P2P exchange
	if(!event.params.isP2P) {
		const grantEntity = Grant.load(application.grant)
		if(grantEntity) {
			grantEntity.funding = grantEntity.funding.minus(amountPaid)
			grantEntity.save()
		}
	}

	entity.save()

	addFundsTransferNotification(disburseEntity)
}