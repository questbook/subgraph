import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts"
import { Workspace } from "../../generated/schema"
import { setEntityValueSafe, Result, getJSONObjectFromIPFS, setEntityArrayValueSafe } from "./json"
import { socialFromJSONValue } from "./social-from-json-value"

export function applyWorkspaceUpdateIpfs(entity: Workspace, hash: string): Result<Workspace> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	entity.metadataHash = hash

	return applyWorkspaceUpdateFromJSON(entity, jsonObjResult.value!, false)
}


export function applyWorkspaceUpdateFromJSON(entity: Workspace, obj: TypedMap<string, JSONValue>, expectAllPresent: boolean): Result<Workspace> {
	let result = setEntityValueSafe(entity, 'title', obj, JSONValueKind.STRING)
	if(result.error && expectAllPresent) return result

	setEntityValueSafe(entity, 'about', obj, JSONValueKind.STRING)
	if(result.error && expectAllPresent) return result

	setEntityValueSafe(entity, 'logoIpfsHash', obj, JSONValueKind.STRING)
	if(result.error && expectAllPresent) return result

	setEntityValueSafe(entity, 'coverImageIpfsHash', obj, JSONValueKind.STRING)

	result = setEntityArrayValueSafe(entity, 'socials', obj, JSONValueKind.OBJECT, socialFromJSONValue)
	if(result.error && expectAllPresent) {
		return { value: null, error: result.error }
	}

	return { value: entity, error: null }
}