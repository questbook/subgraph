import { Transfer } from '../generated/GrantTransfersDAI/ERC20'
import { applyGrantDeposit } from './utils/apply-grant-deposit'

export function handleTransfer(event: Transfer): void {
	applyGrantDeposit(event, event.params.to.toHex(), event.params.value, event.block.timestamp.toI32())
}