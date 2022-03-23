import { Transfer } from '../generated/templates/GrantTransfersERC20/ERC20'
import { applyGrantFundUpdate } from './utils/apply-grant-deposit'

export function handleTransfer(event: Transfer): void {
	applyGrantFundUpdate(event, true, event.params.to.toHex(), event.params.value, event.params.to, event.block.timestamp.toI32())
}