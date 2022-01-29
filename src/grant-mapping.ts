import { log } from "@graphprotocol/graph-ts"
import { GrantCreated } from "../generated/QBGrantsContract/QBGrantsContract"
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

    entity.save()
  } else {
    log.warning(`error in mapping entity: "${entityResult.error!}"`, [])
  }
}
