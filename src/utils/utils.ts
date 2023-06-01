export const typeOf = (
	value: any
): 'string' | 'number' | 'array' | 'object' | 'symbol' | 'bigint' | 'undefined' | 'null' | 'boolean' =>
	Object.prototype.toString.call(value).slice(8, -1).toLowerCase();