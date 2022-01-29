import { Bytes, Entity, ipfs, json, JSONValue, JSONValueKind, log, TypedMap, Value } from "@graphprotocol/graph-ts";

/** Generic result structure to catch successful & errorred results */
export class Result<T> {
	value: T | null = null;
	error: string | null = null;
}

/** safely gets a key from the JSON, and checks it's the right type */
export function getJSONValueSafe(key: string, json: TypedMap<string, JSONValue>, kind: JSONValueKind): Result<JSONValue> {
	const value = json.get(key)
	
	if(!value) {
		return { value: null, error: `"${key}" not present` }
	}
	
	if(value.kind !== kind) {
		return { value: null, error: `expected "${key}" to be "${kind}" found "${value.kind}"` }
	}

	return { value, error: null }
}

/** sets the key in the provided entity from the given JSON. Type checks before setting the value */
export function setEntityValueSafe<T extends Entity>(entity: T, key: string, json: TypedMap<string, JSONValue>, kind: JSONValueKind): Result<T> {
	const valueResult = getJSONValueSafe(key, json, kind)
	if(valueResult.error) return { value: null, error: valueResult.error }

	const value = valueResult.value!

	switch(kind) {
		case JSONValueKind.BOOL:
			entity.set(key, Value.fromBoolean(value.toBool()))
			break
		case JSONValueKind.NUMBER:
			entity.set(key, Value.fromBigInt(value.toBigInt()))
			break
		case JSONValueKind.STRING:
			entity.set(key, Value.fromString(value.toString()))
			break
		default:
			return { value: null, error: `Internal map error` }
	}
	
	return { value: entity, error: null }
}

export function getJSONObjectFromIPFS(hash: string): Result<TypedMap<string, JSONValue>> {
	let data: Bytes | null
	// this mechanism exists to prevent IPFS calls while testing
	// since IPFS is not supported on matchstick as of now
	if(hash.slice(0, 5) == 'json:') {
		data = Bytes.fromUTF8(hash.slice(5))
	} else {
		data = ipfs.cat(hash)
	}

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

	return { value: jsonDataResult.value.toObject(), error: null }
}