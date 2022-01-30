import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts";
import { Grant } from "../../generated/schema";
import { fieldFromJSONValue } from "./field-from-json-value";
import { getJSONObjectFromIPFS, Result, setEntityArrayValueSafe, setEntityValueSafe } from "./json";

export function applyGrantUpdateIpfs(entity: Grant, hash: string): Result<Grant> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	return applyGrantUpdateFromJSON(entity, obj, false)
}


export function applyGrantUpdateFromJSON(entity: Grant, obj: TypedMap<string, JSONValue>, expectAllPresent: boolean): Result<Grant> {
	let result = setEntityValueSafe(entity, 'details', obj, JSONValueKind.STRING)
	if(result.error && expectAllPresent) return result

	result = setEntityArrayValueSafe(entity, 'fields', obj, JSONValueKind.OBJECT, fieldFromJSONValue)
	if(result.error && expectAllPresent) return result

	// optional field, don't care if not present
	result = setEntityValueSafe(entity, 'deadline', obj, JSONValueKind.STRING)

	return { value: entity, error: null }
}

