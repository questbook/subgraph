import { Entity, JSONValue, JSONValueKind, TypedMap, Value } from "@graphprotocol/graph-ts";

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