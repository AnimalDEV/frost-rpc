export interface Parser {
	reviver: (key: unknown, value: unknown) => unknown;
	replacer: (key: unknown, value: unknown) => unknown;
}

export class DefaultParser implements Parser {
	reviver(key: unknown, value: unknown): unknown {
		if(typeof value === "string") {
			const date = DefaultParser.parseDate(value);
			if(date) {
				return date;
			}
		}
		return value;
	}

	replacer(key: unknown, value: unknown): unknown {
		if(value instanceof Date) {
			return value.toISOString();
		}
		return value;
	}

	static parseDate(value: string): Date | false {
		const dateRegex = /^\d\d\d\d-\d\d-\d\dT\d\d:\d\d:\d\d.\d\d\dZ$/;
		if(!dateRegex.test(value)) {
			return false;
		}
		return new Date(value);
	}
}
