import { log, store } from "@graphprotocol/graph-ts"
import {
  WorkspaceMembersUpdated,
  WorkspaceCreated,
  WorkspaceUpdated,
} from "../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract"
import { Workspace, WorkspaceMember } from "../generated/schema"
import { validatedJsonFromIpfs } from "./json-schema/json"
import { validateWorkspaceCreateRequest, validateWorkspaceUpdateRequest, WorkspaceCreateRequest, WorkspaceUpdateRequest } from "./json-schema"
import { mapWorkspaceSocials, mapWorkspaceSupportedNetworks, mapWorkspaceTokens } from "./utils/generics"

export function handleWorkspaceCreated(event: WorkspaceCreated): void {
  const entityId = event.params.id.toHex()
  
  const jsonResult = validatedJsonFromIpfs<WorkspaceCreateRequest>(event.params.metadataHash, validateWorkspaceCreateRequest)
  if(jsonResult.error) {
    log.warning(`[${event.transaction.hash.toHex()}] error in mapping workspace create: "${jsonResult.error!}"`, [])
    return
  }

  const json = jsonResult.value!

  const entity = new Workspace(entityId)
  entity.ownerId = event.params.owner
  entity.title = json.title
  entity.about = json.about
  entity.logoIpfsHash = json.logoIpfsHash
  entity.coverImageIpfsHash = json.coverImageIpfsHash
  entity.supportedNetworks = mapWorkspaceSupportedNetworks(json.supportedNetworks)
  entity.createdAtS = event.params.time.toI32()
  entity.updatedAtS = entity.createdAtS
  entity.socials = mapWorkspaceSocials(entityId, json.socials)
  entity.metadataHash = event.params.metadataHash
  
  const member = new WorkspaceMember(`${entityId}.${event.params.owner.toHex()}`)
  member.actorId = event.params.owner
  member.accessLevel = 'owner'
  member.workspace = entity.id
  member.publicKey = json.creatorPublicKey
  member.addedAt = entity.createdAtS
  member.updatedAt = entity.updatedAtS
  member.save()

  entity.save()
}

export function handleWorkspaceUpdated(event: WorkspaceUpdated): void {
  const entityId = event.params.id.toHex()
  
  const entity = Workspace.load(entityId)
  if(!entity) {
    log.warning(`recv workspace update without workspace existing, ID = ${entityId}`, [])
    return
  }

  entity.updatedAtS = event.params.time.toI32()
  
  const jsonResult = validatedJsonFromIpfs<WorkspaceUpdateRequest>(event.params.metadataHash, validateWorkspaceUpdateRequest)
  if(jsonResult.error) {
    log.warning(`[${event.transaction.hash.toHex()}] error in mapping workspace update: "${jsonResult.error!}"`, [])
    return
  }

  const json = jsonResult.value!
  if(json.title) entity.title = json.title!
  if(json.about) entity.about = json.about!
  if(json.logoIpfsHash) entity.logoIpfsHash = json.logoIpfsHash!
  if(json.coverImageIpfsHash) entity.coverImageIpfsHash = json.coverImageIpfsHash
  if(json.socials) entity.socials = mapWorkspaceSocials(entityId, json.socials!)
  if(json.tokens) entity.tokens = mapWorkspaceTokens(entityId, json.tokens!)
  if(json.publicKey) {
    const memberId = event.transaction.from.toHex()
    const mem = WorkspaceMember.load(`${entityId}.${memberId}`)
    if(mem) {
      mem.publicKey = json.publicKey
      mem.updatedAt = entity.updatedAtS
      mem.save()
    } else {
      log.warning(`[${event.transaction.hash.toHex()}] recv publicKey update but member not found`, [])
    }
  }

  entity.save()
}

export function handleWorkspaceMembersUpdated(event: WorkspaceMembersUpdated): void {
  const entityId = event.params.id.toHex()
  
  const entity = Workspace.load(entityId)
  if(!entity) {
    log.warning(`recv workspace members update without workspace existing, ID = ${entityId}`, [])
    return
  }
  
  entity.updatedAtS = event.params.time.toI32()
  const removals: string[] = []
  // add the admins
  for(let i = 0;i < event.params.members.length;i++) {
    const memberId = event.params.members[i]
    const role = event.params.roles[i]
    const enabled = event.params.enabled[i]

    const id = `${entityId}.${memberId.toHex()}`
    
    if(enabled) {
      let member = WorkspaceMember.load(id)
      if(!member) {
        member = new WorkspaceMember(id)
        member.addedAt = entity.updatedAtS
      }

      member.actorId = memberId
      member.email = event.params.emails[i]
      member.updatedAt = entity.updatedAtS
      if(role === 0) { // become an admin
        member.accessLevel = 'admin'
      } else if(role === 1) { // become a reviewer
        member.accessLevel = 'reviewer'
      }
      member.workspace = entityId
      member.save()

      // if this member was to be removed
      // cancel that
      const removeIdx = removals.indexOf(id)
      removals.splice(removeIdx, 1)
    } else {
      removals.push(id)
    }
  }

  for(let i = 0;i < removals.length;i++) {
    store.remove('WorkspaceMember', removals[i])
  }

  entity.save()
}
