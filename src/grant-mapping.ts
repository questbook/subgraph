import { log } from "@graphprotocol/graph-ts"
import { GrantCreated } from "../generated/QBGrantFactoryContract/QBGrantFactoryContract"
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication } from "../generated/schema"
import { DisburseReward, DisburseRewardFailed, FundsDeposited, FundsDepositFailed, FundsWithdrawn, GrantUpdated } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { applyGrantFundUpdate } from "./utils/apply-grant-deposit"
import { applyGrantUpdateIpfs } from "./utils/apply-grant-update-ipfs"
import { grantFromGrantCreateIPFS } from "./utils/grant-from-grant-create-ipfs"
import { addFundsTransferNotification } from "./utils/notifications"

export function handleGrantCreated(event: GrantCreated): void {
  const workspaceId = event.params.workspaceId
  const grantAddress = event.params.grantAddress
  
  const grantId = grantAddress.toHex()
  const entityResult = grantFromGrantCreateIPFS(grantId, event.params.metadataHash)
  if(entityResult.value) {
    const entity = entityResult.value!
    entity.creatorId = event.transaction.from
    entity.workspace = workspaceId.toHex()
    entity.acceptingApplications = true
    entity.createdAtS = event.params.time.toI32()

    entity.save()
  } else {
    log.warning(`error in mapping entity: "${entityResult.error!}"`, [])
  }
}

export function handleDisburseReward(event: DisburseReward): void {
  const applicationId = event.params.applicationId.toHex()
  const milestoneIndex = event.params.milestoneId.toI32()
  const milestoneId = `${applicationId}.${milestoneIndex}.milestone`
  const amountPaid = event.params.amount

  const disburseEntity = new FundsTransfer(event.transaction.hash.toHex())
  disburseEntity.createdAtS = event.params.time.toI32()
  disburseEntity.amount = amountPaid
  disburseEntity.sender = event.params.sender
  disburseEntity.to = event.transaction.to!
  disburseEntity.application = applicationId
  disburseEntity.milestone = milestoneId
  disburseEntity.type = "funds_disbursed"

  disburseEntity.save()

  const entity = ApplicationMilestone.load(milestoneId)
  if(entity) {
    entity.amountPaid = entity.amountPaid.plus(amountPaid)
    entity.updatedAtS = event.params.time.toI32()

    // find grant and reduce the amount of the funding
    const application = GrantApplication.load(applicationId)
    if(application) {
      const grantEntity = Grant.load(application.grant)
      if(grantEntity) {
        grantEntity.funding = grantEntity.funding.minus(amountPaid)
        grantEntity.save()
      }

      disburseEntity.grant = application.grant
    }

    entity.save()

    addFundsTransferNotification(disburseEntity)
  } else {
    log.warning(`recv milestone updated for unknown application: ID="${milestoneId}"`, [])
  }
}

export function handleDisburseRewardFailed(event: DisburseRewardFailed): void {
  
}

export function handleFundsDepositFailed(event: FundsDepositFailed): void {
  
}

export function handleFundsDeposited(event: FundsDeposited): void {
  applyGrantFundUpdate(event, true, event.transaction.to!.toHex(), event.params.amount, event.transaction.to!, event.params.time.toI32())
}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  applyGrantFundUpdate(event, false, event.transaction.from.toHex(), event.params.amount, event.params.recipient, event.params.time.toI32())
}

export function handleGrantUpdated(event: GrantUpdated): void {
  const grantId = event.transaction.to!.toHex()

  const entity = Grant.load(grantId)
  if(entity) {
    entity.updatedAtS = event.params.time.toI32()
    entity.workspace = event.params.workspaceId.toHex()
    entity.acceptingApplications = event.params.active

    const hash = event.params.metadataHash
    if(hash.length) {
      const result = applyGrantUpdateIpfs(entity, hash)
      if(result.error) {
        log.warning(`error in updating grant metadata, error: ${result.error!}`, [])
        return
      }
    }

    entity.save()
  } else {
    log.warning(`recv grant update for unknown grant, ID="${grantId}"`, [])
  }
}