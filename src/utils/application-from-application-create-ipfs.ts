import { JSONValueKind } from "@graphprotocol/graph-ts";
import { GrantApplication } from "../../generated/schema";
import { applyApplicationUpdateFromJSON, parseGrantFieldAnswer } from "./apply-application-update-ipfs";
import { getJSONObjectFromIPFS, getJSONValueSafe, Result } from "./json";

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
		const result = parseGrantFieldAnswer(id, fieldsList[i])
		if(result.error) {
			return { value: null, error: result.error }
		}

		result.value!.save()
		fields.push(result.value!.id)
	}

	entity.fields = fields

	return { value: entity, error: null }
}