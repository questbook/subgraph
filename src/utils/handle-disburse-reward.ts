import { Address, BigInt, Bytes, ethereum, log } from '@graphprotocol/graph-ts'
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication, Workspace } from '../../generated/schema'
import { getUSDReward } from './generics'
import { addFundsTransferNotification } from './notifications'

class disburseRewardInterface {
	event: ethereum.Event;
	depositType: string;
	_applicationId: string;
	_milestoneId: i32;
	_asset: Bytes;
	_tokenName: string;
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
	const tokenName = rewardProps._tokenName
	const nonEvmAssetAddress = rewardProps._nonEvmAsset
	const txnHash = rewardProps._txnHash

	const application = GrantApplication.load(applicationId)
	if(!application) {
		log.warning(`[${rewardProps._txnHash}] recv disburse reward for unknown application: ID="${applicationId}"`, [])
		return
	}

	log.info(`[${rewardProps._txnHash}] recv disburse reward for application: ID="${applicationId}"`, [])

	var disburseEntity: FundsTransfer 
	if(rewardProps.depositType == 'funds_disbursed_from_safe') {
		disburseEntity = new FundsTransfer(`${txnHash}.${applicationId}`)
		disburseEntity.status = 'queued'
		log.info(`[${rewardProps._txnHash}.${applicationId}] recv disburse reward for application: ID="${applicationId}"`, [])
	} else if(rewardProps.depositType == 'funds_disbursed_from_wallet') {
		disburseEntity = new FundsTransfer(`${txnHash}.${applicationId}`)
		disburseEntity.status = 'executed'
		log.info(`[${rewardProps._txnHash}.${applicationId}] recv disburse reward for application: ID="${applicationId}"`, [])
	} else {
		disburseEntity = new FundsTransfer(`${rewardProps.event.transaction.hash.toHex()}.${applicationId}`)
		disburseEntity.status = 'executed'
		log.info(`[${rewardProps._txnHash}] txnHash is empty`, [])
	}

	disburseEntity.createdAtS = eventTime
	disburseEntity.amount = amountPaid
	disburseEntity.sender = rewardProps._sender
	disburseEntity.to = rewardProps.event.transaction.to!
	disburseEntity.application = applicationId
	disburseEntity.milestone = milestoneId
	disburseEntity.type = rewardProps.depositType
	disburseEntity.grant = application.grant
	disburseEntity.transactionHash = txnHash

	if(asset) {
		disburseEntity.asset = asset
	} else {
		disburseEntity.asset = Address.fromString('0x0')
	}


	if(nonEvmAssetAddress) {
		disburseEntity.nonEvmAsset = nonEvmAssetAddress
	}

	if(tokenName && tokenName != '') {
		disburseEntity.tokenName = tokenName
	}

	disburseEntity.save()

	const entity = ApplicationMilestone.load(milestoneId)
	if(!entity) {
		log.warning(`[${rewardProps.event.transaction.hash.toHex()}] recv milestone updated for unknown milestone: ID="${milestoneId}"`, [])
		return
	}

	entity.amountPaid = entity.amountPaid.plus(amountPaid)
	entity.updatedAtS = eventTime

	const grantEntity = Grant.load(application.grant)
	if(grantEntity) {
		const workspace = Workspace.load(grantEntity.workspace)
		if(workspace) {
			if(disburseEntity.type != 'funds_disbursed_from_safe' && disburseEntity.type != 'funds_disbursed_from_wallet') {
				const usd = getUSDReward(asset, amountPaid)
				if(usd > 0) {
					workspace.totalGrantFundingDisbursedUSD += usd
				}

				workspace.save()
			}
		} else {
			log.warning(`[${rewardProps.event.transaction.hash.toHex()}] workspace not found for grant: ${grantEntity.id}`, [])
		}

		// find grant and reduce the amount of the funding
		// only if not a P2P exchange
		if(!rewardProps._isP2P) {
			grantEntity.funding = grantEntity.funding.minus(amountPaid)
			grantEntity.save()
		}
	} else {
		log.warning(`[${rewardProps.event.transaction.hash.toHex()}] recv disburse reward for unknown grant: ID="${application.grant}"`, [])
		return
	}

	entity.save()

	addFundsTransferNotification(disburseEntity)
}