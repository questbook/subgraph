import { BigInt, Bytes, Entity, ipfs, json, JSONValue, JSONValueKind, TypedMap, Value } from "@graphprotocol/graph-ts";

const NUMBER_SET = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']

class SavableEntity extends Entity {
	save(): void {
		throw new Error('not implemented')
	}
}

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
	let valueResult = getJSONValueSafe(key, json, kind)
	if(valueResult.error) {
		// number can be a string as well, to accommodate bigints
		// so we check if the string parsing works
		if(kind === JSONValueKind.NUMBER) {
			valueResult = getJSONValueSafe(key, json, JSONValueKind.STRING)
		}
		if(valueResult.error) {
			return { value: null, error: valueResult.error }
		}
	}

	const value = valueResult.value!

	switch(kind) {
		case JSONValueKind.BOOL:
			entity.set(key, Value.fromBoolean(value.toBool()))
			break
		case JSONValueKind.NUMBER:
			// get number as string
			let decimalString = changetype<string>(value.data as u32)
			// ensure it is a valid number
			for(let i = 0;i < decimalString.length;i++) {
				const char = decimalString.charAt(i)
				if(!NUMBER_SET.includes(char)) {
					return { value: null, error: `unexpected character '${char}' in integer '${key}'` }
				}
			}
			entity.set(key, Value.fromBigInt(BigInt.fromString(decimalString)))
			break
		case JSONValueKind.STRING:
			entity.set(key, Value.fromString(value.toString()))
			break
		default:
			return { value: null, error: `Internal map error` }
	}
	
	return { value: entity, error: null }
}

/** sets the key in the provided entity from the given JSON. Type checks before setting the value */
export function setEntityArrayValueSafe<T extends Entity, E extends SavableEntity>(
	entity: T, 
	key: string, 
	json: TypedMap<string, JSONValue>, 
	elementKind: JSONValueKind, 
	perElement: (json: JSONValue, id: string, index: i32) => Result<E>
): Result<T> {
	const valueResult = getJSONValueSafe(key, json, JSONValueKind.ARRAY)
	if(valueResult.error) return { value: null, error: valueResult.error }

	const jsonArray = valueResult.value!.toArray()
	const elements: string[] = []

	for(let i = 0; i < jsonArray.length;i++) {
		const jsonEl = jsonArray[i]
		if(jsonEl.kind !== elementKind) {
			return { value: null, error: `Expected element in "${key}" to be "${elementKind}"` }
		}

		const id = entity.get('id')!.toString()
		const result = perElement(jsonEl, id, i)
		if(result.error) return { value: null, error: result.error }

		result.value!.save()
		elements.push(result.value!.get('id')!.toString())
	}

	entity.set(key, Value.fromStringArray(elements))
	
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

export function byteArrayFromHexStringSafe(str: string): Result<Bytes> {
	if(str.startsWith('0x')) {
		// remove the 0x
		str = str.slice(2)
	}

	if(str.length % 2 !== 0) {
		return { value: null, error: 'String must be multiple of 2' }
	}

	const network = Bytes.fromHexString(str)
	return { value: Bytes.fromByteArray(network), error: null }
}