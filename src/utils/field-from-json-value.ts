import { JSONValue, JSONValueKind } from "@graphprotocol/graph-ts"
import { GrantField } from "../../generated/schema"
import { getJSONValueSafe, setEntityValueSafe, Result } from "./json"

export function fieldFromJSONValue(json: JSONValue, grantId: string, _: i32): Result<GrantField> {
	const fieldObj = json.toObject()
	const fieldIdResult = getJSONValueSafe('id', fieldObj, JSONValueKind.STRING)
	if(fieldIdResult.error) return { value: null, error: fieldIdResult.error }

	const field = new GrantField(`${grantId}.${fieldIdResult.value!.toString()}`)

	let result = setEntityValueSafe(field, 'title', fieldObj, JSONValueKind.STRING)
	if(result.error) return result

	if(fieldObj.get('enum')) {
		const enumsResult = getJSONValueSafe('enum', fieldObj, JSONValueKind.ARRAY)
		if(!enumsResult.error) return { value: null, error: enumsResult.error }

		const enumsArray = enumsResult.value!.toArray()
		field.possibleValues = []
		for(let j = 0;j < enumsArray.length;j++) {
			const value = enumsArray[j]
			if(value.kind !== JSONValueKind.STRING) {
				return { value: null, error: 'Enum value not string' }
			}
			field.possibleValues!.push(value.toString())
		}
	}

	const inputTypeResult = getJSONValueSafe('inputType', fieldObj, JSONValueKind.STRING)
	const inputTypeValue = inputTypeResult.value!.toString()
	if(inputTypeValue === 'long-form') {
		field.inputType = 'long_form'
	} else if(inputTypeValue === 'numeric') {
		field.inputType = 'numeric'
	} else {
		field.inputType = 'short_form'
	} 

	return { value: field, error: null }
}