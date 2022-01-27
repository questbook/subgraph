import { log } from "@graphprotocol/graph-ts"
import { GrantCreated } from "../generated/QBGrantsContract/QBGrantsContract"
import { Reward } from "../generated/schema"
import { grantFromGrantCreateIPFS } from "./utils/grant-from-grant-create-ipfs"

export function handleGrantCreated(event: GrantCreated): void {
  const workspaceId = event.params.workspaceId
  const grantAddress = event.params.grantAddress
  const rewardAsset = event.params.rewardAsset
  const rewardCommitted = event.params.rewardCommited 
  
  // unique ID constructed by concatenating workspace + grant address
  const grantId = workspaceId.toHex() + "." + grantAddress.toHex()
  const entityResult = grantFromGrantCreateIPFS(grantId, event.params.metadataHash)
  if(entityResult.value) {
    // construct reward from event data
    const reward = new Reward(`${grantId}.reward`)
    reward.asset = rewardAsset
    reward.committed = rewardCommitted.toI32()
    // initially nothing is allotted or paid
    reward.alloted = 0
    reward.paid = 0
    reward.save()

    const entity = entityResult.value!
    entity.reward = reward.id
    entity.creatorId = event.transaction.from
    entity.workspace = workspaceId.toHex()
    entity.save()
  } else {
    log.warning(`error in mapping entity: "${entityResult.error!}"`, [])
  }
}
