import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts";
import { Grant } from "../../generated/schema";
import { fieldFromJSONValue } from "./field-from-json-value";
import { getJSONObjectFromIPFS, getJSONValueSafe, Result, setEntityValueSafe } from "./json";

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

	const fieldsObjResult = getJSONValueSafe('fields', obj, JSONValueKind.OBJECT)
	if(fieldsObjResult.error && expectAllPresent) return { value: null, error: fieldsObjResult.error }

	if(fieldsObjResult.value) {
		const fieldsObj = fieldsObjResult.value!.toObject()
		const fieldsList = fieldsObj.entries
	
		const fields: string[] = []
	
		for(let i = 0; i < fieldsList.length;i++) {
			const result = fieldFromJSONValue(entity.id, fieldsList[i])
			if(result.error) {
				return { value: null, error: result.error }
			}
	
			result.value!.save()
			fields.push(result.value!.id)
		}
	
		entity.fields = fields
	}

	// optional field, don't care if not present
	result = setEntityValueSafe(entity, 'deadline', obj, JSONValueKind.STRING)

	return { value: entity, error: null }
}

