import { Bytes, JSONValue, json, log } from "@graphprotocol/graph-ts"
import { Result } from './json'

/// Validate a Bytes object using a given function
export function validatedContent<T>(content: Bytes, mapFunction: (json: JSONValue) => Result<T>): Result<T> {
	if(!content) {
		log.warning(`The content for is empty`, [])
		return { value: null, error: 'File not found' }
	}

	const jsonDataResult = json.try_fromBytes(content)
	if(!jsonDataResult.isOk) {
		return { value: null, error: 'Invalid JSON' }
	}

	if(!jsonDataResult.value) {
		return { value: null, error: 'Null JSON' }
	}

	return mapFunction(jsonDataResult.value)
}
