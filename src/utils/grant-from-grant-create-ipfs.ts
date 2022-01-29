import { JSONValueKind } from "@graphprotocol/graph-ts"
import { Grant, GrantField } from "../../generated/schema"
import { getJSONValueSafe, setEntityValueSafe, Result, getJSONObjectFromIPFS } from "./json"

export function grantFromGrantCreateIPFS(id: string, hash: string): Result<Grant> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	
	const entity = new Grant(id)
	entity.metadataHash = hash

	let result = setEntityValueSafe(entity, 'title', obj, JSONValueKind.STRING)
	if(result.error) return result

	result = setEntityValueSafe(entity, 'summary', obj, JSONValueKind.STRING)
	if(result.error) return result
	
	result = setEntityValueSafe(entity, 'details', obj, JSONValueKind.STRING)
	if(result.error) return result

	// optional field, don't care if not present
	result = setEntityValueSafe(entity, 'deadline', obj, JSONValueKind.STRING)
	
	const fieldsJSONResult = getJSONValueSafe('fields', obj, JSONValueKind.ARRAY)
	if(fieldsJSONResult.error) {
		return { value: null, error: fieldsJSONResult.error }
	}

	const fieldsJSONArray = fieldsJSONResult.value!.toArray()

	const fields: string[] = []
	for(let i = 0;i < fieldsJSONArray.length;i++) {
		const jsonValue = fieldsJSONArray[i]
		if(jsonValue.kind !== JSONValueKind.OBJECT) {
			return { value: null, error: 'Field element not object' }
		}

		const fieldObj = jsonValue.toObject()
		const fieldIdResult = getJSONValueSafe('id', fieldObj, JSONValueKind.STRING)
		if(fieldIdResult.error) return { value: null, error: fieldIdResult.error }

		const field = new GrantField(`${id}.${fieldIdResult.value!.toString()}`)

		let result = setEntityValueSafe(field, 'title', fieldObj, JSONValueKind.STRING)
		if(result.error) return { value: null, error: result.error }

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

		field.save()

		fields.push(field.id)
	}

	entity.fields = fields

	return { value: entity, error: null }
}
