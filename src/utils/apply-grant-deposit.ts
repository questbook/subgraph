import { Address, BigInt, ethereum, log } from '@graphprotocol/graph-ts'
import { FundsTransfer, Grant, Reward } from '../../generated/schema'
import { addFundsTransferNotification } from './notifications'

export function applyGrantFundUpdate(
	event: ethereum.Event,
	isDeposit: boolean,
	grantId: string,
	amount: BigInt,
	recipient: Address,
	eventTime: i32
): boolean {
	const transactionId = event.transaction.hash.toHex()

	const entity = Grant.load(grantId)
	if(!entity) {
		log.debug(`recv funds ${isDeposit ? 'deposit' : 'withdraw'} for unknown grant, ID="${grantId}"`, [])
		return false
	}

	const fundEntity = new FundsTransfer(transactionId)
	fundEntity.createdAtS = eventTime
	fundEntity.sender = event.transaction.from
	fundEntity.to = recipient
	fundEntity.grant = grantId
	fundEntity.amount = amount

	const reward = Reward.load(entity.reward)
	if(!reward) {
		log.warning(`reward for grant missing "${entity.reward}"`, [])
		return false
	}

	fundEntity.asset = reward.asset


	if(isDeposit) {
		fundEntity.type = 'funds_deposited'
		entity.funding = entity.funding.plus(amount)
	} else {
		fundEntity.type = 'funds_withdrawn'
		entity.funding = entity.funding.minus(amount)
	}

	fundEntity.status = 'executed'

	fundEntity.save()

	entity.updatedAtS = eventTime

	entity.save()

	addFundsTransferNotification(fundEntity)

	log.info(`added funding to grant ID=${grantId}, amount=${amount.toString()}`, [])
	return true
}
