import { JSONValue, JSONValueKind, TypedMap } from "@graphprotocol/graph-ts";
import { Grant, Reward } from "../../generated/schema";
import { fieldFromJSONValue } from "./field-from-json-value";
import { byteArrayFromHexStringSafe, getJSONObjectFromIPFS, getJSONValueSafe, Result, setEntityStringSafe, setEntityValueSafe } from "./json";

export function applyGrantUpdateIpfs(entity: Grant, hash: string): Result<Grant> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	return applyGrantUpdateFromJSON(entity, obj, false)
}

export function applyGrantUpdateFromJSON(entity: Grant, obj: TypedMap<string, JSONValue>, expectAllPresent: boolean): Result<Grant> {
	let result = setEntityStringSafe(entity, 'details', obj, { maxLength: 0 })
	if(result.error && expectAllPresent) return result

	result = setEntityStringSafe(entity, 'title', obj, { maxLength: 255 })
	if(result.error && expectAllPresent) return result

	result = setEntityStringSafe(entity, 'summary', obj, { maxLength: 1024 })
	if(result.error && expectAllPresent) return result

	const rewardObj = obj.get('reward')
	if(rewardObj) {
		const reward = rewardFromJSONValue(rewardObj, entity.id)
		if(reward.error) {
			return { value: null, error: reward.error }
		}
		reward.value!.save()

		entity.reward = reward.value!.id
	} else if(expectAllPresent) {
		return { value: null, error: "Reward not present" }
	}

	const fieldsObjResult = getJSONValueSafe('fields', obj, JSONValueKind.OBJECT)
	if(fieldsObjResult.error && expectAllPresent) return { value: null, error: fieldsObjResult.error }

	if(fieldsObjResult.value) {
		const fieldsObj = fieldsObjResult.value!.toObject()
		const fieldsList = fieldsObj.entries
	
		const fields: string[] = []
	
		for(let i = 0; i < fieldsList.length;i++) {
			const result = fieldFromJSONValue(entity.id, fieldsList[i])
			if(result.error) {
				return { value: null, error: result.error }
			}
	
			result.value!.save()
			fields.push(result.value!.id)
		}
	
		entity.fields = fields
	}

	// optional field, don't care if not present
	result = setEntityStringSafe(entity, 'deadline', obj, { maxLength: 80 })

	return { value: entity, error: null }
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

	return { value: reward, error: null }
}