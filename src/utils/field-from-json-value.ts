import { JSONValue, JSONValueKind, TypedMapEntry } from "@graphprotocol/graph-ts"
import { GrantField } from "../../generated/schema"
import { getJSONValueSafe, setEntityValueSafe, Result } from "./json"

export function fieldFromJSONValue(grantId: string, entry: TypedMapEntry<string, JSONValue>): Result<GrantField> {
	if(entry.value.kind !== JSONValueKind.OBJECT) {
		return { value: null, error: `Expected grant field '${entry.key}' to be an object` }
	}

	const fieldId = entry.key
	const fieldObj = entry.value.toObject()

	const field = new GrantField(`${grantId}.${fieldId.toString()}`)

	let result = setEntityValueSafe(field, 'title', fieldObj, JSONValueKind.STRING)
	if(result.error) return result

	if(fieldObj.get('enum')) {
		const enumsResult = getJSONValueSafe('enum', fieldObj, JSONValueKind.ARRAY)
		if(enumsResult.error) return { value: null, error: enumsResult.error }

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
	if(inputTypeResult.error) return { value: null, error: inputTypeResult.error }

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