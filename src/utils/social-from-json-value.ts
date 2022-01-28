import { JSONValue, JSONValueKind } from "@graphprotocol/graph-ts"
import { Social } from "../../generated/schema"
import { setEntityValueSafe, Result } from "./json"

export function socialFromJSONValue(parentId: string, jsonValue: JSONValue): Result<Social> {
	if(jsonValue.kind !== JSONValueKind.OBJECT) {
		return { value: null, error: 'supported social expected to be an object' }
	}

	const jsonObj = jsonValue.toObject()
	
	const social = new Social('')

	let result = setEntityValueSafe(social, 'name', jsonObj, JSONValueKind.STRING)
	if(result.error) return result

	result = setEntityValueSafe(social, 'value', jsonObj, JSONValueKind.STRING)
	if(result.error) return result

	social.id = `${parentId}.${social.name.toLowerCase()}`

	return { value: social, error: null }
}