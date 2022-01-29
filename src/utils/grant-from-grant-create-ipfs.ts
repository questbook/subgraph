import { JSONValue, JSONValueKind } from "@graphprotocol/graph-ts"
import { Grant, GrantField, Reward } from "../../generated/schema"
import { getJSONValueSafe, setEntityValueSafe, Result, getJSONObjectFromIPFS, setEntityArrayValueSafe, byteArrayFromHexStringSafe } from "./json"

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
	
	setEntityArrayValueSafe(entity, 'fields', obj, JSONValueKind.OBJECT, fieldFromJSONValue)

	const rewardObj = obj.get('reward')
	if(!rewardObj) {
		return { value: null, error: "Reward not present" }
	}

	const reward = rewardFromJSONValue(rewardObj, entity.id)
	reward.value!.save()

	entity.reward = reward.value!.id

	return { value: entity, error: null }
}

function fieldFromJSONValue(json: JSONValue, grantId: string, _: i32): Result<GrantField> {
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

function rewardFromJSONValue(json: JSONValue, grantId: string): Result<Reward> {
	if(json.kind !== JSONValueKind.OBJECT) {
		return { value: null, error: 'Expected object for "reward"' }
	}
	const obj = json.toObject()
    // construct reward from event data
    const reward = new Reward(`${grantId}.reward`)
	let result = setEntityValueSafe(reward, 'committed', obj, JSONValueKind.NUMBER)
	if(result.error) return result

	const assetResult = getJSONValueSafe('asset', obj, JSONValueKind.STRING)
	if(assetResult.error) return { value: null, error: assetResult.error }

	const hexResult = byteArrayFromHexStringSafe(assetResult.value!.toString())
	if(hexResult.error) return { value: null, error: hexResult.error }
	
	reward.asset = hexResult.value!
    // initially nothing is allotted or paid
    reward.alloted = 0
    reward.paid = 0

	return { value: reward, error: null }
}