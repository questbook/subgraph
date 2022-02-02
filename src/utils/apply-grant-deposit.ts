import { Address, BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import { FundsDeposit, Grant } from "../../generated/schema"

export function applyGrantDeposit(event: ethereum.Event, grantId: string, amount: BigInt, eventTime: i32): void {
	const transactionId = event.transaction.index.toHex()

	const entity = Grant.load(grantId)
	if (entity) {
		const fundEntity = new FundsDeposit(transactionId)
		fundEntity.createdAtS = eventTime
		fundEntity.from = event.transaction.from
		fundEntity.grant = grantId
		fundEntity.amount = amount

		fundEntity.save()

		entity.updatedAtS = eventTime
		entity.funding = entity.funding.plus(amount)

		entity.save()

		log.info(`added funding to grant ID=${grantId}, amount=${amount.toString()}`, [])
	} else {
		log.debug(`recv funds deposit for unknown grant, ID="${grantId}"`, [])
	}
}
