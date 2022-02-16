import { Grant } from "../../generated/schema"
import { applyGrantUpdateFromJSON } from "./apply-grant-update-ipfs"
import { Result, getJSONObjectFromIPFS } from "./json"

export function grantFromGrantCreateIPFS(id: string, hash: string): Result<Grant> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	
	const entity = new Grant(id)
	entity.metadataHash = hash

	let result = applyGrantUpdateFromJSON(entity, obj, true)
	if(result.error) return result

	return { value: entity, error: null }
}