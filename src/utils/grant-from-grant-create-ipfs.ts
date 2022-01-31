import { JSONValue, JSONValueKind } from "@graphprotocol/graph-ts"
import { Grant, Reward } from "../../generated/schema"
import { applyGrantUpdateFromJSON } from "./apply-grant-update-ipfs"
import { getJSONValueSafe, setEntityValueSafe, Result, getJSONObjectFromIPFS, byteArrayFromHexStringSafe } from "./json"

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
	
	result = applyGrantUpdateFromJSON(entity, obj, true)
	if(result.error) return result

	const rewardObj = obj.get('reward')
	if(!rewardObj) {
		return { value: null, error: "Reward not present" }
	}

	const reward = rewardFromJSONValue(rewardObj, entity.id)
	if(reward.error) {
		return { value: null, error: reward.error }
	}
	reward.value!.save()

	entity.reward = reward.value!.id

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