import { JSONValue, JSONValueKind, TypedMap, TypedMapEntry } from "@graphprotocol/graph-ts";
import { GrantApplication, GrantFieldAnswer } from "../../generated/schema";
import { getJSONObjectFromIPFS, getJSONValueSafe, MAX_STR_LENGTH, Result, setEntityArrayValueSafe, setEntityStringSafe, setEntityValueSafe } from "./json";
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
	let result = setEntityStringSafe(entity, 'feedback', obj, { maxLength: 2048 })

	const fieldsObjResult = getJSONValueSafe('fields', obj, JSONValueKind.OBJECT)
	if(fieldsObjResult.error && expectAllPresent) return { value: null, error: fieldsObjResult.error }

	if(fieldsObjResult.value) {	
		const fieldsObj = fieldsObjResult.value!.toObject()
		const fieldsList = fieldsObj.entries

		const fields: string[] = []

		for(let i = 0; i < fieldsList.length;i++) {
			const result = parseGrantFieldAnswer(entity.id, fieldsList[i])
			if(result.error) {
				return { value: null, error: result.error }
			}

			result.value!.save()
			fields.push(result.value!.id)
		}

		entity.fields = fields
	}

	result = setEntityArrayValueSafe(entity, 'milestones', obj, JSONValueKind.OBJECT, milestoneFromJSONValue)
	if(result.error && expectAllPresent) return result

	return { value: entity, error: null }
}

export function parseGrantFieldAnswer(applicationId: string, entry: TypedMapEntry<string, JSONValue>): Result<GrantFieldAnswer> {
	const field = new GrantFieldAnswer(`${applicationId}.${entry.key.toString()}.field`)
	field.field = entry.key

	const strList: string[] = []

	switch(entry.value.kind) {
		case JSONValueKind.STRING:
			strList.push(entry.value.toString())
			break
		case JSONValueKind.ARRAY:
			const valueList = entry.value.toArray()
			for(let j = 0;j < valueList.length;j++) {
				if(valueList[j].kind !== JSONValueKind.STRING) {
					return { value: null, error: 'expected each field value to be string' }
				}
				strList.push(valueList[j].toString())
			}
			break
		default:
			return { value: null, error: 'expected field value to be string or string array' }
	}

	let totalSize = 0

	for(let i = 0;i < strList.length;i++) {
		const str = strList[i]
		totalSize += str.length
		if(str.length > MAX_STR_LENGTH || totalSize > MAX_STR_LENGTH) {
			return { value: null, error: `Maximum length for field is ${MAX_STR_LENGTH} but was ${str.length}` }
		}
	}

	field.value = strList

	return { value: field, error: null }
}