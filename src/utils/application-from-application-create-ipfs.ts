import { BigDecimal, JSONValue, JSONValueKind } from "@graphprotocol/graph-ts";
import { ApplicationMember, ApplicationMilestone, GrantApplication, GrantFieldAnswer } from "../../generated/schema";
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

	setEntityArrayValueSafe(entity, 'fields', obj, JSONValueKind.OBJECT, grantFieldAnswerFromJSONValue)
	setEntityArrayValueSafe(entity, 'members', obj, JSONValueKind.OBJECT, memberFromJSONValue)

	return { value: entity, error: null }
}

function grantFieldAnswerFromJSONValue(json: JSONValue, applicationId: string, _: i32): Result<GrantFieldAnswer> {
	const objResult = json.toObject()
	const idValueResult = getJSONValueSafe('id', objResult, JSONValueKind.STRING)
	if(idValueResult.error) {
		return { value: null, error: idValueResult.error }
	}

	const field = new GrantFieldAnswer(`${applicationId}.${idValueResult.value!.toString()}.field`)
	let result = setEntityValueSafe(field, 'value', objResult, JSONValueKind.STRING)
	if(result.error) return { value: null, error: result.error }

	return { value: field, error: null }
}

function memberFromJSONValue(json: JSONValue, applicationId: string, index: i32): Result<ApplicationMember> {
	const objResult = json.toObject()
	
	const member = new ApplicationMember(`${applicationId}.${index}.member`)
	const result = setEntityValueSafe(member, 'details', objResult, JSONValueKind.STRING)
	if(result.error) return result

	return { value: member, error: null }
}