export class RpcError extends Error {
	readonly code: number;
	readonly message: string;
	readonly data?: unknown;

	constructor(code: number, message: string, data?: unknown) {
		super(message);
		this.code = code;
		this.message = message;
		this.data = data;
		this.name = "RpcError";
		Error.captureStackTrace(this, RpcError);
	}

	static isError(error: RpcError): boolean {
		if(!error || typeof error !== "object" || Array.isArray(error)) {
			return false;
		}
		const {code, message} = error;
		return !!(code && message);
	}
}

export class ParseError extends RpcError {
	constructor(data?: unknown) {
		super(-32700, "Parse error", data);
		this.name = "ParseError";
		Error.captureStackTrace(this, ParseError);
	}
}

export class MissingMethodError extends RpcError {
	constructor(data?: unknown) {
		super(-32601, "Method not found", data);
		this.name = "MissingMethodError";
		Error.captureStackTrace(this, MissingMethodError);
	}
}

export class InvalidVersionError extends RpcError {
	constructor(data?: unknown) {
		super(-32099, "Invalid JSON-RPC version", data);
		this.name = "InvalidVersionError";
		Error.captureStackTrace(this, InvalidVersionError);
	}
}

export class InvalidRequestError extends RpcError {
	constructor(data?: unknown) {
		super(-32600, "Invalid Request", data);
		this.name = "InvalidRequestError";
		Error.captureStackTrace(this, InvalidRequestError);
	}
}

export class InvalidParams extends RpcError {
	constructor(data?: unknown) {
		super(-32602, "Invalid params", data);
		this.name = "InvalidParams";
		Error.captureStackTrace(this, InvalidParams);
	}
}

export class InternalError extends RpcError {
	constructor(data?: unknown) {
		super(-32603, "Internal error", data);
		this.name = "InternalError";
		Error.captureStackTrace(this, InternalError);
	}
}
