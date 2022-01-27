import { ipfs, json, JSONValueKind } from "@graphprotocol/graph-ts"
import { Grant, GrantField } from "../../generated/schema"
import { getJSONValueSafe, setEntityValueSafe, Result } from "./json"

export function grantFromGrantCreateIPFS(id: string, hash: string): Result<Grant> {
	const data = ipfs.cat(hash)
	if(!data) {
		return { value: null, error: 'File not found' }
	}

	const jsonDataResult = json.try_fromBytes(data)
	if(!jsonDataResult.isOk) {
		return { value: null, error: 'Invalid JSON' }
	}

	if(jsonDataResult.value.kind !== JSONValueKind.OBJECT) {
		return { value: null, error: 'JSON not object' }
	}

	const obj = jsonDataResult.value.toObject()
	
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

	entity.fields = []
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

		entity.fields.push(field.id)
	}

	return { value: entity, error: null }
}
