import { JSONValue, JSONValueKind } from "@graphprotocol/graph-ts"
import { Social } from "../../generated/schema"
import { Result, setEntityStringSafe } from "./json"

export function socialFromJSONValue(jsonValue: JSONValue, parentId: string, _: i32): Result<Social> {
	if(jsonValue.kind !== JSONValueKind.OBJECT) {
		return { value: null, error: 'supported social expected to be an object' }
	}

	const jsonObj = jsonValue.toObject()
	
	const social = new Social('')

	let result = setEntityStringSafe(social, 'name', jsonObj, { maxLength: 64 })
	if(result.error) return result

	result = setEntityStringSafe(social, 'value', jsonObj, { maxLength: 255 })
	if(result.error) return result

	social.id = `${parentId}.${social.name.toLowerCase()}`

	return { value: social, error: null }
}