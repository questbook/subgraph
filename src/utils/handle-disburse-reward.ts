import { BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication } from '../../generated/schema'
import { addFundsTransferNotification } from './notifications'

export class disburseRewardInterface {
	event: ethereum.Event;
	depositType: string;
	_applicationId: string;
	_milestoneId: i32;
	_sender: Bytes;
	_amount: BigInt;
	 _isP2P: boolean

}

export function disburseReward(rewardProps: disburseRewardInterface): void {
	const applicationId = rewardProps._applicationId
	const milestoneIndex = rewardProps._milestoneId
	const milestoneId = `${applicationId}.${milestoneIndex}`
	const amountPaid = rewardProps._amount
	const eventTime = rewardProps.event.block.timestamp.toI32()

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${rewardProps.event.transaction.hash.toHex()}] recv disburse reward for unknown application: ID="${applicationId}"`, [])
		return
	}

	const disburseEntity = new FundsTransfer(rewardProps.event.transaction.hash.toHex())
	disburseEntity.createdAtS = eventTime
	disburseEntity.amount = amountPaid
	disburseEntity.sender = rewardProps._sender
	disburseEntity.to = rewardProps.event.transaction.to!
	disburseEntity.application = applicationId
	disburseEntity.milestone = milestoneId
	disburseEntity.type = rewardProps.depositType
	disburseEntity.grant = application.grant

	disburseEntity.save()

	const entity = ApplicationMilestone.load(milestoneId)
	if(!entity) {
		log.warning(`[${rewardProps.event.transaction.hash.toHex()}] recv milestone updated for unknown milestone: ID="${milestoneId}"`, [])
		return
	}

	entity.amountPaid = entity.amountPaid.plus(amountPaid)
	entity.updatedAtS = eventTime
	// find grant and reduce the amount of the funding
	// only if not a P2P exchange
	if(!rewardProps._isP2P) {
		const grantEntity = Grant.load(application.grant)
		if(grantEntity) {
			grantEntity.funding = grantEntity.funding.minus(amountPaid)
			grantEntity.save()
		}
	}

	entity.save()

	addFundsTransferNotification(disburseEntity)
}