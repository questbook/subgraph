import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts";
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
	if(fieldsObjResult.value) {
		const projectDetailsValueResult = getJSONValueSafe(PROJECT_DETAILS_KEY, fieldsObjResult.value!.toObject(), JSONValueKind.STRING)
		if(projectDetailsValueResult.value) {
			const field = new GrantFieldAnswer(`${entity.id}.${PROJECT_DETAILS_KEY}.field`)
			field.field = PROJECT_DETAILS_KEY
			field.value = projectDetailsValueResult.value!.toString()

			field.save()
		}
	}

	result = setEntityArrayValueSafe(entity, 'milestones', obj, JSONValueKind.OBJECT, milestoneFromJSONValue)
	if(result.error && expectAllPresent) return result

	return { value: entity, error: null }
}