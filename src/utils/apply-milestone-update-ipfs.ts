import { JSONValueKind } from "@graphprotocol/graph-ts";
import { ApplicationMilestone } from "../../generated/schema";
import { getJSONObjectFromIPFS, Result, setEntityValueSafe } from "./json";

export function applyMilestoneUpdateIpfs(entity: ApplicationMilestone, hash: string): Result<ApplicationMilestone> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!

	setEntityValueSafe(entity, 'text', obj, JSONValueKind.STRING)

	return { value: entity, error: null }
}