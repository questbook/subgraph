import { log } from "@graphprotocol/graph-ts"
import {
  WorkspaceAdminsAdded,
  WorkspaceAdminsRemoved,
  WorkspaceCreated, WorkspaceUpdated,
} from "../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract"
import { Workspace, WorkspaceMember } from "../generated/schema"
import { applyWorkspaceUpdateIpfs } from "./utils/apply-workspace-update-ipfs"
import { workspaceFromWorkspaceCreateIPFS } from "./utils/workspace-from-workspace-create-ipfs"

export function handleWorkspaceCreated(event: WorkspaceCreated): void {
  const entityId = event.params.id.toHex()
  
  const entityResult = workspaceFromWorkspaceCreateIPFS(entityId, event.params.metadataHash)
  if(entityResult.value) {
    const entity = entityResult.value!
    entity.ownerId = event.params.owner
    entity.createdAtS = event.params.time.toI32()
    
    const member = new WorkspaceMember(`${entityId}.${event.params.owner.toHex()}`)
    member.actorId = event.params.owner
    member.save()

    entity.members = [member.id]

    entity.save()
  } else {
    log.warning(`error in mapping workspace create: "${entityResult.error!}"`, [])
  }
}

export function handleWorkspaceUpdated(event: WorkspaceUpdated): void {
  const entityId = event.params.id.toHex()
  
  let entity = Workspace.load(entityId)
  if(entity) {
    entity.updatedAtS = event.params.time.toI32()

    const updateResult = applyWorkspaceUpdateIpfs(entity, event.params.metadataHash)
    if(updateResult.value) {
      entity.save()
    } else {
      log.warning(`error in mapping workspace update: "${updateResult.error!}"`, [])
    }
  } else {
    log.warning(`recv workspace update without workspace existing, ID = ${entityId}`, [])
  }
}

export function handleWorkspaceAdminsAdded(event: WorkspaceAdminsAdded): void {
  const entityId = event.params.id.toHex()
  
  let entity = Workspace.load(entityId)
  if(entity) {
    entity.updatedAtS = event.params.time.toI32()
    // add the admins
    for(let i = 0;i < event.params.admins.length;i++) {
      const memberId = event.params.admins[i]
      const id = `${entityId}.${memberId.toHex()}`
      const member = new WorkspaceMember(id)
      member.actorId = memberId
      member.email = event.params.emails[i]
      member.save()

      entity.members.push(member.id)
    }

    entity.save()
  } else {
    log.warning(`recv workspace admins add without workspace existing, ID = ${entityId}`, [])
  }
}

export function handleWorkspaceAdminsRemoved(event: WorkspaceAdminsRemoved): void {
  const entityId = event.params.id.toHex()
  
  let entity = Workspace.load(entityId)
  if(entity) {
    entity.updatedAtS = event.params.time.toI32()
    // create a set of members to remove for fast check & removal from entity.members
    const membersToRemoveSet = new Set<string>()
    for(let i = 0;i < event.params.admins.length;i++) {
      const id = `${entityId}.${event.params.admins[i].toHex()}`
      membersToRemoveSet.add(id)
    }
    // filter out removed members
    let i = 0
    while(i < entity.members.length) {
      if(membersToRemoveSet.has(entity.members[i])) {
        entity.members.splice(0, 1)
        continue
      }
      i += 1
    }

    entity.save()
  } else {
    log.warning(`recv workspace admins add without workspace existing, ID = ${entityId}`, [])
  }
}
