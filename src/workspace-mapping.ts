import { log, store } from "@graphprotocol/graph-ts"
import {
  WorkspaceAdminsAdded,
  WorkspaceAdminsRemoved,
  WorkspaceCreated, WorkspaceUpdated,
} from "../generated/QBWorkspaceRegistryContract/QBWorkspaceRegistryContract"
import { Workspace, WorkspaceMember } from "../generated/schema"
import { validatedJsonFromIpfs } from "./json-schema/json"
import { validateWorkspaceCreateRequest, validateWorkspaceUpdateRequest, WorkspaceCreateRequest, WorkspaceUpdateRequest } from "./json-schema"
import { mapWorkspaceSocials, mapWorkspaceSupportedNetworks } from "./utils/generics"

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

export function handleWorkspaceAdminsAdded(event: WorkspaceAdminsAdded): void {
  const entityId = event.params.id.toHex()
  
  const entity = Workspace.load(entityId)
  if(!entity) {
    log.warning(`recv workspace admins add without workspace existing, ID = ${entityId}`, [])
    return
  }
  
  entity.updatedAtS = event.params.time.toI32()
  // add the admins
  for(let i = 0;i < event.params.admins.length;i++) {
    const memberId = event.params.admins[i]
    const id = `${entityId}.${memberId.toHex()}`
    const member = new WorkspaceMember(id)
    member.actorId = memberId
    member.email = event.params.emails[i]
    member.accessLevel = 'admin'
    member.workspace = entityId
    member.addedAt = entity.updatedAtS
    member.updatedAt = entity.updatedAtS
    member.save()
  }
  entity.save()
}

export function handleWorkspaceAdminsRemoved(event: WorkspaceAdminsRemoved): void {
  const entityId = event.params.id.toHex()
  
  let entity = Workspace.load(entityId)
  if(entity) {
    entity.updatedAtS = event.params.time.toI32()
    for(let i = 0;i < event.params.admins.length;i++) {
      const id = `${entityId}.${event.params.admins[i].toHex()}`
      store.remove('WorkspaceMember', id)
    }
    entity.save()
  } else {
    log.warning(`recv workspace admins remove without workspace existing, ID = ${entityId}`, [])
  }
}
