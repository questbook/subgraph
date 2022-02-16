import { JSONValue, JSONValueKind, TypedMap, TypedMapEntry } from "@graphprotocol/graph-ts";
import { GrantApplication, GrantFieldAnswer } from "../../generated/schema";
import { getJSONObjectFromIPFS, getJSONValueSafe, Result, setEntityArrayValueSafe, setEntityValueSafe } from "./json";
import { milestoneFromJSONValue } from "./milestone-from-json-value";

const PROJECT_DETAILS_KEY = 'projectDetails'

export function applyApplicationUpdateIpfs(entity: GrantApplication, hash: string): Result<GrantApplication> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	return applyApplicationUpdateFromJSON(entity, obj, false)
}

export function applyApplicationUpdateFromJSON(entity: GrantApplication, obj: TypedMap<string, JSONValue>, expectAllPresent: boolean): Result<GrantApplication> {
	let result = setEntityValueSafe(entity, 'feedback', obj, JSONValueKind.STRING)

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

	switch(entry.value.kind) {
		case JSONValueKind.STRING:
			field.value = [entry.value.toString()]
			break
		case JSONValueKind.ARRAY:
			const strList: string[] = []
			const valueList = entry.value.toArray()
			for(let j = 0;j < valueList.length;j++) {
				if(valueList[j].kind !== JSONValueKind.STRING) {
					return { value: null, error: 'expected each field value to be string' }
				}
				strList.push(valueList[j].toString())
			}
			field.value = strList
			break
		default:
			return { value: null, error: 'expected field value to be string or string array' }
	}

	return { value: field, error: null }
}