import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts";
import { GrantApplication } from "../../generated/schema";
import { getJSONObjectFromIPFS, Result, setEntityArrayValueSafe, setEntityValueSafe } from "./json";
import { milestoneFromJSONValue } from "./milestone-from-json-value";

export function applyApplicationUpdateIpfs(entity: GrantApplication, hash: string): Result<GrantApplication> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	return applyApplicationUpdateFromJSON(entity, obj, false)
}

export function applyApplicationUpdateFromJSON(entity: GrantApplication, obj: TypedMap<string, JSONValue>, expectAllPresent: boolean): Result<GrantApplication> {
	let result = setEntityValueSafe(entity, 'details', obj, JSONValueKind.STRING)
	if(result.error && expectAllPresent) return result

	result = setEntityValueSafe(entity, 'feedback', obj, JSONValueKind.STRING)

	result = setEntityArrayValueSafe(entity, 'milestones', obj, JSONValueKind.OBJECT, milestoneFromJSONValue)
	if(result.error && expectAllPresent) return result

	return { value: entity, error: null }
}