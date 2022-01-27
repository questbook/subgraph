import { log } from "@graphprotocol/graph-ts"
import {
  WorkspaceCreated, WorkspaceUpdated,
} from "../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract"
import { Workspace } from "../generated/schema"
import { workspaceFromWorkspaceCreateIPFS } from "./utils/workspace-from-workspace-create-ipfs"

export function handleWorkspaceCreated(event: WorkspaceCreated): void {
  const entityId = event.params.id.toHex()
  
  const entityResult = workspaceFromWorkspaceCreateIPFS(entityId, event.params.metadataHash)
  if(entityResult.value) {
    entityResult.value!.ownerId = event.params.owner
    entityResult.value!.save()
  } else {
    log.warning(`error in mapping entity: "${entityResult.error!}"`, [])
  }
}

export function handleWorkspaceUpdated(event: WorkspaceUpdated): void {
  const entityId = event.params.id.toHex()
  
  let entity = Workspace.load(entityId)
  if(entity) {
    entity.ownerId = event.params.owner
    entity.metadataHash = event.params.metadataHash
    
    entity.save()
  } else {
    log.warning(`recv workspace update without workspace existing, ID = ${entityId}`, [])
  }

}
