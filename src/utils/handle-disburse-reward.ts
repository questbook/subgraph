import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication } from '../../generated/schema'
import { addFundsTransferNotification } from './notifications'

class disburseRewardInterface {
	event: ethereum.Event;
	depositType: string;
	_applicationId: string;
	_milestoneId: i32;
	_asset: Bytes;
	_nonEvmAsset: string;
	_txnHash: string;
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
	const asset = rewardProps._asset
	const nonEvmAssetAddress = rewardProps._nonEvmAsset
	const txnhHash = rewardProps._txnHash

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${rewardProps.event.transaction.hash.toHex()}] recv disburse reward for unknown application: ID="${applicationId}"`, [])
		return
	}

	const disburseEntity = new FundsTransfer(`${rewardProps.event.transaction.hash.toHex()}.${applicationId}`)
	disburseEntity.createdAtS = eventTime
	disburseEntity.amount = amountPaid
	disburseEntity.sender = rewardProps._sender
	disburseEntity.to = rewardProps.event.transaction.to!
	disburseEntity.application = applicationId
	disburseEntity.milestone = milestoneId
	disburseEntity.type = rewardProps.depositType
	disburseEntity.grant = application.grant
	disburseEntity.transactionHash = txnhHash

	if(asset) {
		disburseEntity.asset = asset
	} else {
		disburseEntity.asset = Address.fromString('0x0')
	}

	if(nonEvmAssetAddress) {
		disburseEntity.nonEvmAsset = nonEvmAssetAddress
	}

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