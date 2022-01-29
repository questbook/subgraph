

export function assertArrayNotEmpty<T>(array: T[]): void {
	if(!array.length) {
		throw new Error(`expected array to not be empty`)
	}
}

export function assertStringNotEmpty(str: string, key: string = ''): void {
	if(!str.length) {
		throw new Error(`expected string '${key}' to not be empty`)
	}
}