import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts"
import { Workspace } from "../../generated/schema"
import { getJSONValueSafe, setEntityValueSafe, Result, getJSONObjectFromIPFS } from "./json"
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

	entity.socials = []

	const socialsJSONArrayResult = getJSONValueSafe('socials', obj, JSONValueKind.ARRAY)
	if(socialsJSONArrayResult.error && expectAllPresent) {
		return { value: null, error: socialsJSONArrayResult.error }
	}

	if(socialsJSONArrayResult.value) {
		const socialsJSONArray = socialsJSONArrayResult.value!.toArray()
		for(let i = 0;i < socialsJSONArray.length;i++) {
			const socialResult = socialFromJSONValue(entity.id, socialsJSONArray[i])
			if(socialResult.error) {
				return { value: null, error: socialResult.error }
			}
	
			socialResult.value!.save()
	
			entity.socials.push(socialResult.value!.id)
		}
	}

	return { value: entity, error: null }
}