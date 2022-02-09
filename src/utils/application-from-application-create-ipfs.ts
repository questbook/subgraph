import { JSONValue, JSONValueKind } from "@graphprotocol/graph-ts";
import { ApplicationMember, GrantApplication, GrantFieldAnswer } from "../../generated/schema";
import { applyApplicationUpdateFromJSON } from "./apply-application-update-ipfs";
import { getJSONObjectFromIPFS, getJSONValueSafe, Result, setEntityArrayValueSafe, setEntityValueSafe } from "./json";

export function applicationFromApplicationCreateIpfs(id: string, hash: string): Result<GrantApplication> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	
	const entity = new GrantApplication(id)
	let result = applyApplicationUpdateFromJSON(entity, obj, true)
	if(result.error) return result

	const fieldsObjResult = getJSONValueSafe('fields', obj, JSONValueKind.OBJECT)
	if(fieldsObjResult.error) return { value: null, error: fieldsObjResult.error }

	const fieldsObj = fieldsObjResult.value!.toObject()
	const fieldsList = fieldsObj.entries

	const fields: string[] = []

	for(let i = 0; i < fieldsList.length;i++) {
		const entry = fieldsList[i]
		
		const field = new GrantFieldAnswer(`${id}.${entry.key.toString()}.field`)
		field.field = entry.key

		if(entry.value.kind !== JSONValueKind.STRING) {
			return { value: null, error: 'expected field value to be string' }
		}
		
		field.value = entry.value.toString()

		field.save()

		fields.push(field.id)
	}

	entity.fields = fields

	setEntityArrayValueSafe(entity, 'members', obj, JSONValueKind.OBJECT, memberFromJSONValue)

	return { value: entity, error: null }
}

function memberFromJSONValue(json: JSONValue, applicationId: string, index: i32): Result<ApplicationMember> {
	const objResult = json.toObject()
	
	const member = new ApplicationMember(`${applicationId}.${index}.member`)
	const result = setEntityValueSafe(member, 'details', objResult, JSONValueKind.STRING)
	if(result.error) return result

	return { value: member, error: null }
}