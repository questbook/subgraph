import { Bytes, JSONValueKind, log } from "@graphprotocol/graph-ts"
import { Workspace } from "../../generated/schema"
import { applyWorkspaceUpdateFromJSON } from "./apply-workspace-update-ipfs"
import { getJSONValueSafe, Result, getJSONObjectFromIPFS } from "./json"

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

	const supportedNetworks: string[] = []

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

		const str = supportedNetworkJSONArray[i].toString()
		let enumValue: string
		if(str.localeCompare('1') === 0) {
			enumValue = 'chain_1'
		} else if(str.localeCompare('4') === 0) {
			enumValue = 'chain_4'
		} else if(str.localeCompare('137') === 0) {
			enumValue = 'chain_137'
		} else if(str.localeCompare('80001') === 0) {
			enumValue = 'chain_80001'
		} else {
			return { value: null, error: `invalid chain '${str}'` }
		}

		supportedNetworks.push(enumValue)
	}

	entity.supportedNetworks = supportedNetworks

	return { value: entity, error: null }
}