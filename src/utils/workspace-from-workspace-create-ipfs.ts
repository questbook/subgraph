import { Bytes, ipfs, json, JSONValueKind } from "@graphprotocol/graph-ts"
import { Workspace } from "../../generated/schema"
import { getJSONValueSafe, setEntityValueSafe, Result } from "./json"

export function workspaceFromWorkspaceCreateIPFS(id: string, hash: string): Result<Workspace> {
	const data = ipfs.cat(hash)
	if(!data) {
		return { value: null, error: 'File not found' }
	}

	const jsonDataResult = json.try_fromBytes(data)
	if(!jsonDataResult.isOk) {
		return { value: null, error: 'Invalid JSON' }
	}

	if(jsonDataResult.value.kind !== JSONValueKind.OBJECT) {
		return { value: null, error: 'JSON not object' }
	}

	const obj = jsonDataResult.value.toObject()

	const entity = new Workspace(id)
	entity.metadataHash = hash

	let result = setEntityValueSafe(entity, 'title', obj, JSONValueKind.STRING)
	if(result.error) return result

	result = setEntityValueSafe(entity, 'about', obj, JSONValueKind.STRING)
	if(result.error) return result

	result = setEntityValueSafe(entity, 'logoIpfsHash', obj, JSONValueKind.STRING)
	if(result.error) return result

	entity.supportedNetworks = []

	const supportedNetworkJSONArrayResult = getJSONValueSafe('supportedNetworks', obj, JSONValueKind.ARRAY)
	if(supportedNetworkJSONArrayResult.error) {
		return { value: null, error: supportedNetworkJSONArrayResult.error }
	}

	const supportedNetworkJSONArray = supportedNetworkJSONArrayResult.value!.toArray()
	for(let i = 0;i < supportedNetworkJSONArray.length;i++) {
		if(supportedNetworkJSONArray[i].kind !== JSONValueKind.STRING) {
			return { value: null, error: 'supported network expected to be string' }
		}

		let networkStr = supportedNetworkJSONArray[i].toString()
		if(networkStr.startsWith('0x')) {
			// remove the 0x
			networkStr = networkStr.slice(2)
		}

		const network = Bytes.fromHexString(networkStr)
		entity.supportedNetworks.push(Bytes.fromByteArray(network))
	}

	return { value: entity, error: null }
}