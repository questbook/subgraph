import { Bytes, JSONValueKind, log } from "@graphprotocol/graph-ts"
import { Workspace } from "../../generated/schema"
import { applyWorkspaceUpdateFromJSON } from "./apply-workspace-update-ipfs"
import { getJSONValueSafe, Result, getJSONObjectFromIPFS, byteArrayFromHexStringSafe } from "./json"

export function workspaceFromWorkspaceCreateIPFS(id: string, hash: string): Result<Workspace> {
	const jsonObjResult = getJSONObjectFromIPFS(hash)
	if(!jsonObjResult.value) {
		return { value: null, error: jsonObjResult.error! }
	}

	const obj = jsonObjResult.value!

	const entity = new Workspace(id)
	entity.metadataHash = hash

	// update is a subset of the create request
	// so we can apply the properties in the update via this function
	applyWorkspaceUpdateFromJSON(entity, obj, true)

	const supportedNetworks: Bytes[] = []

	const supportedNetworkJSONArrayResult = getJSONValueSafe('supportedNetworks', obj, JSONValueKind.ARRAY)
	if(supportedNetworkJSONArrayResult.error) {
		return { value: null, error: supportedNetworkJSONArrayResult.error }
	}

	const supportedNetworkJSONArray = supportedNetworkJSONArrayResult.value!.toArray()
	if(!supportedNetworkJSONArray.length) {
		return { value: null, error: 'Expected at least one supported network' }
	}

	for(let i = 0;i < supportedNetworkJSONArray.length;i++) {
		if(supportedNetworkJSONArray[i].kind !== JSONValueKind.STRING) {
			return { value: null, error: 'supported network expected to be string' }
		}

		let networkStrResult = byteArrayFromHexStringSafe(supportedNetworkJSONArray[i].toString())
		if(networkStrResult.error) return { value: null, error: networkStrResult.error }

		supportedNetworks.push(networkStrResult.value!)
	}

	entity.supportedNetworks = supportedNetworks

	return { value: entity, error: null }
}