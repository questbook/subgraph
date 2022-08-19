import { BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication } from '../../generated/schema'
import { addFundsTransferNotification } from './notifications'

export function disburseReward(event: ethereum.Event, depositType: string, _applicationId: string, _milestoneId: string, _sender: Bytes, _amount: BigInt, _isP2P: boolean, _eventTime: i32): void {
	const applicationId = _applicationId
	const milestoneIndex = _milestoneId
	const milestoneId = `${applicationId}.${milestoneIndex}`
	const amountPaid = _amount

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${event.transaction.hash.toHex()}] recv disburse reward for unknown application: ID="${applicationId}"`, [])
		return
	}

	const disburseEntity = new FundsTransfer(event.transaction.hash.toHex())
	disburseEntity.createdAtS = _eventTime
	disburseEntity.amount = amountPaid
	disburseEntity.sender = _sender
	disburseEntity.to = event.transaction.to!
	disburseEntity.application = applicationId
	disburseEntity.milestone = milestoneId
	disburseEntity.type = depositType
	disburseEntity.grant = application.grant

	disburseEntity.save()

	const entity = ApplicationMilestone.load(milestoneId)
	if(!entity) {
		log.warning(`[${event.transaction.hash.toHex()}] recv milestone updated for unknown milestone: ID="${milestoneId}"`, [])
		return
	}

	entity.amountPaid = entity.amountPaid.plus(amountPaid)
	entity.updatedAtS = _eventTime
	// find grant and reduce the amount of the funding
	// only if not a P2P exchange
	if(!_isP2P) {
		const grantEntity = Grant.load(application.grant)
		if(grantEntity) {
			grantEntity.funding = grantEntity.funding.minus(amountPaid)
			grantEntity.save()
		}
	}

	entity.save()

	addFundsTransferNotification(disburseEntity)
}