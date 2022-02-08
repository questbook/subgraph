import { BigInt, ethereum, log } from "@graphprotocol/graph-ts"
import { FundsTransfer, Grant } from "../../generated/schema"
import { addFundsTransferNotification } from "./notifications"

export function applyGrantDeposit(event: ethereum.Event, grantId: string, amount: BigInt, eventTime: i32): void {
	const transactionId = event.transaction.hash.toHex()

	const entity = Grant.load(grantId)
	if (entity) {
		const fundEntity = new FundsTransfer(transactionId)
		fundEntity.createdAtS = eventTime
		fundEntity.sender = event.transaction.from
		fundEntity.to = event.transaction.to!
		fundEntity.grant = grantId
		fundEntity.amount = amount
		fundEntity.type = "funds_deposited"

		fundEntity.save()

		entity.updatedAtS = eventTime
		entity.funding = entity.funding.plus(amount)

		entity.save()

		addFundsTransferNotification(fundEntity)

		log.info(`added funding to grant ID=${grantId}, amount=${amount.toString()}`, [])
	} else {
		log.debug(`recv funds deposit for unknown grant, ID="${grantId}"`, [])
	}
}
