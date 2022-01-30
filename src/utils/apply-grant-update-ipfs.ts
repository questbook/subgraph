import { Grant } from "../../generated/schema";
import { getJSONObjectFromIPFS, Result } from "./json";

export function applyGrantUpdateIpfs(entity: Grant, hash: string): Result<Grant> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!


	return { value: entity, error: null }
}