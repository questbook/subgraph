import { JSONValueKind } from "@graphprotocol/graph-ts";
import { GrantApplication } from "../../generated/schema";
import { getJSONObjectFromIPFS, Result, setEntityValueSafe } from "./json";

export function applyApplicationUpdateIpfs(entity: GrantApplication, hash: string): Result<GrantApplication> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!


	return { value: entity, error: null }
}