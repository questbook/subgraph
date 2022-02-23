import { GrantApplication } from "../../generated/schema";
import { applyApplicationUpdateFromJSON, FeedbackType } from "./apply-application-update-ipfs";
import { getJSONObjectFromIPFS, Result } from "./json";

export function applicationFromApplicationCreateIpfs(id: string, hash: string): Result<GrantApplication> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!
	
	const entity = new GrantApplication(id)
	let result = applyApplicationUpdateFromJSON(entity, obj, true, FeedbackType.none)
	if(result.error) return result

	return { value: entity, error: null }
}