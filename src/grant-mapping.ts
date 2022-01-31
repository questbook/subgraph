import { log } from "@graphprotocol/graph-ts"
import { GrantCreated } from "../generated/QBGrantFactoryContract/QBGrantFactoryContract"
import { ApplicationMilestone, FundsDeposit, FundsDisburse, Grant } from "../generated/schema"
import { DisburseReward, DisburseRewardFailed, FundsDeposited, FundsDepositFailed, GrantUpdated } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { applyGrantUpdateIpfs } from "./utils/apply-grant-update-ipfs"
import { grantFromGrantCreateIPFS } from "./utils/grant-from-grant-create-ipfs"

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

  const disburseEntity = new FundsDisburse(event.transaction.index.toHex())
  disburseEntity.createdAtS = event.params.time.toI32()
  disburseEntity.amount = amountPaid
  disburseEntity.to = event.transaction.to!
  disburseEntity.application = applicationId
  disburseEntity.milestone = milestoneId

  disburseEntity.save()

  const entity = ApplicationMilestone.load(milestoneId)
  if(entity) {
    entity.amountPaid = entity.amountPaid.plus( amountPaid )
    entity.updatedAtS = event.params.time.toI32()

    entity.save()
  } else {
    log.warning(`recv milestone updated for unknown application: ID="${milestoneId}"`, [])
  }
}

export function handleDisburseRewardFailed(event: DisburseRewardFailed): void {
  
}

export function handleFundsDepositFailed(event: FundsDepositFailed): void {
  
}

export function handleFundsDeposited(event: FundsDeposited): void {
  const transactionId = event.transaction.index.toHex()
  const grantId = event.transaction.to!.toHex()
  const amount = event.params.amount

  const fundEntity = new FundsDeposit(transactionId)
  fundEntity.createdAtS = event.params.time.toI32()
  fundEntity.from = event.transaction.from
  fundEntity.grant = grantId
  fundEntity.amount = amount

  fundEntity.save()

  const entity = Grant.load(grantId)
  if(entity) {
    entity.updatedAtS = event.params.time.toI32()
    entity.funding = entity.funding.plus( amount )

    entity.save()
  } else {
    log.warning(`recv funds deposit for unknown grant, ID="${grantId}"`, [])
  }
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