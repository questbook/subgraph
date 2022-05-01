import { BigInt, log } from "@graphprotocol/graph-ts"
import { GrantCreated } from "../generated/QBGrantFactoryContract/QBGrantFactoryContract"
import { ApplicationMilestone, FundsTransfer, Grant, GrantApplication, Workspace } from "../generated/schema"
import { DisburseReward, DisburseRewardFailed, FundsDepositFailed, FundsWithdrawn, GrantUpdated } from "../generated/templates/QBGrantsContract/QBGrantsContract"
import { applyGrantFundUpdate } from "./utils/apply-grant-deposit"
import { isPlausibleIPFSHash, mapGrantFieldMap, mapGrantManagers, mapGrantRewardAndListen, removeEntityCollection } from "./utils/generics"
import { addFundsTransferNotification } from "./utils/notifications"
import { QBGrantsContract } from "../generated/templates"
import { validatedJsonFromIpfs } from "./json-schema/json"
import { validateGrantCreateRequest, GrantCreateRequest, validateGrantUpdateRequest, GrantUpdateRequest } from "./json-schema"

export function handleGrantCreated(event: GrantCreated): void {
  const workspaceId = event.params.workspaceId.toHex()
  const grantAddress = event.params.grantAddress

  const workspace = Workspace.load(workspaceId)
  if(!workspace) {
    log.warning(`[${event.transaction.hash.toHex()}] error in mapping grant: "workspace (${workspaceId}) not found"`, [])
    return
  }

  const entityResult = validatedJsonFromIpfs<GrantCreateRequest>(event.params.metadataHash, validateGrantCreateRequest)
  if(entityResult.error) {
    log.warning(`[${event.transaction.hash.toHex()}] error in mapping grant: "${entityResult.error!}"`, [])
    return
  }

  const json = entityResult.value!
  const entity = new Grant(grantAddress.toHex())
  entity.creatorId = event.transaction.from
  entity.title = json.title
  entity.summary = json.summary
  entity.details = json.details
  
  const reward = mapGrantRewardAndListen(entity.id, workspaceId, json.reward)

  entity.reward = reward.id
  entity.workspace = workspaceId
  entity.deadline = json.deadline

  entity.fields = mapGrantFieldMap(entity.id, json.fields)

  entity.metadataHash = event.params.metadataHash
  entity.acceptingApplications = true
  entity.createdAtS = event.params.time.toI32()
  entity.funding = new BigInt(0)
  entity.numberOfApplications = 0
  entity.managers = mapGrantManagers(json.grantManagers, entity.id, entity.workspace)

  entity.save()

  QBGrantsContract.create(grantAddress)
}

export function handleDisburseReward(event: DisburseReward): void {
  const applicationId = event.params.applicationId.toHex()
  const milestoneIndex = event.params.milestoneId.toI32()
  const milestoneId = `${applicationId}.${milestoneIndex}`
  const amountPaid = event.params.amount

  const application = GrantApplication.load(applicationId)
  if(!application) {
    log.warning(`[${event.transaction.hash.toHex()}] recv disburse reward for unknown application: ID="${applicationId}"`, [])
    return
  }

  const disburseEntity = new FundsTransfer(event.transaction.hash.toHex())
  disburseEntity.createdAtS = event.params.time.toI32()
  disburseEntity.amount = amountPaid
  disburseEntity.sender = event.params.sender
  disburseEntity.to = event.transaction.to!
  disburseEntity.application = applicationId
  disburseEntity.milestone = milestoneId
  disburseEntity.type = "funds_disbursed"
  disburseEntity.grant = application.grant

  disburseEntity.save()

  const entity = ApplicationMilestone.load(milestoneId)
  if(!entity) {
    log.warning(`[${event.transaction.hash.toHex()}] recv milestone updated for unknown application: ID="${milestoneId}"`, [])
    return
  }

  entity.amountPaid = entity.amountPaid.plus(amountPaid)
  entity.updatedAtS = event.params.time.toI32()
  // find grant and reduce the amount of the funding
  // only if not a P2P exchange
  if(!event.params.isP2P) {
    const grantEntity = Grant.load(application.grant)
    if(grantEntity) {
      grantEntity.funding = grantEntity.funding.minus(amountPaid)
      grantEntity.save()
    }
  }

  entity.save()

  addFundsTransferNotification(disburseEntity)
}

export function handleDisburseRewardFailed(event: DisburseRewardFailed): void {
  
}

export function handleFundsDepositFailed(event: FundsDepositFailed): void {
  
}

export function handleFundsWithdrawn(event: FundsWithdrawn): void {
  const grantId = event.transaction.to!.toHex()
  const success = applyGrantFundUpdate(event, false, grantId, event.params.amount, event.params.recipient, event.params.time.toI32())
  if(!success) {
    log.error(`funds withdraw for grant, but grant not found, ID=${grantId}`, [])
  }
}

export function handleGrantUpdated(event: GrantUpdated): void {
  const grantId = event.transaction.to!.toHex()

  const entity = Grant.load(grantId)
  if(!entity) {
    log.warning(`[${event.transaction.hash.toHex()}] recv grant update for unknown grant, ID="${grantId}"`, [])
    return
  }

  entity.updatedAtS = event.params.time.toI32()
  entity.workspace = event.params.workspaceId.toHex()
  entity.acceptingApplications = event.params.active

  const hash = event.params.metadataHash
  if(isPlausibleIPFSHash(hash)) {
    const jsonResult = validatedJsonFromIpfs<GrantUpdateRequest>(hash, validateGrantUpdateRequest)
    if(jsonResult.error) {
      log.warning(`[${event.transaction.hash.toHex()}] error in updating grant metadata, error: ${jsonResult.error!}`, [])
      return
    }

    const json = jsonResult.value!
    if(json.title) entity.title = json.title!
    if(json.summary) entity.summary = json.summary!
    if(json.details) entity.details = json.details!
    if(json.deadline) entity.deadline = json.deadline!
    if(json.reward) {
      entity.reward = mapGrantRewardAndListen(entity.id, entity.workspace, json.reward!).id
    }
    if(json.fields) {
      entity.fields = mapGrantFieldMap(entity.id, json.fields!)
    }
    if(json.grantManagers && json.grantManagers!.length) {
      removeEntityCollection('GrantManager', entity.managers)
      entity.managers = mapGrantManagers(json.grantManagers, entity.id, entity.workspace)
    }
  }

  entity.save()
}