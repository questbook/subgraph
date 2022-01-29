import { JSONValue, JSONValueKind } from "@graphprotocol/graph-ts";
import { ApplicationMember, ApplicationMilestone, GrantApplication, GrantFieldAnswer } from "../../generated/schema";
import { getJSONObjectFromIPFS, getJSONValueSafe, Result, setEntityArrayValueSafe, setEntityValueSafe } from "./json";

export function applicationFromApplicationCreateIpfs(id: string, hash: string): Result<GrantApplication> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	
	const entity = new GrantApplication(id)
	let result = setEntityValueSafe(entity, 'details', obj, JSONValueKind.STRING)
	if(result.error) return result

	setEntityArrayValueSafe(entity, 'fields', obj, JSONValueKind.OBJECT, grantFieldAnswerFromJSONValue)
	setEntityArrayValueSafe(entity, 'members', obj, JSONValueKind.OBJECT, memberFromJSONValue)
	setEntityArrayValueSafe(entity, 'milestones', obj, JSONValueKind.OBJECT, milestoneFromJSONValue)

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

function milestoneFromJSONValue(json: JSONValue, applicationId: string, index: i32): Result<ApplicationMilestone> {
	const objResult = json.toObject()
	
	const milestone = new ApplicationMilestone(`${applicationId}.${index}.milestone`)
	milestone.state = 'submitted'

	let result = setEntityValueSafe(milestone, 'title', objResult, JSONValueKind.STRING)
	if(result.error) return result

	result = setEntityValueSafe(milestone, 'amount', objResult, JSONValueKind.NUMBER)
	if(result.error) return result

	return { value: milestone, error: null }
}