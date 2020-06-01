import { InvalidRequestError } from "./RpcError";
import { InvalidVersionError } from "./RpcError";

export class Request {
	jsonrpc: string;
	id: string | number;
	method: string;
	params?: Array<unknown> | { [key: string]: unknown };

	constructor(id: number | string, method: string, params?: Array<unknown> | { [key: string]: unknown }) {
		this.jsonrpc = "2.0";
		this.id = id;
		this.method = method;
		this.params = params;
	}

	static validateRequest(request: Request): void {
		const isObject = typeof request === "object" && request != null && !Array.isArray(request);
		if (!isObject) {
			throw new InvalidRequestError("Request should be an object");
		}
		if (request?.jsonrpc !== "2.0") {
			throw new InvalidVersionError("JSONRPC version property should be 2.0");
		}
		if (request?.id != null) {
			if (!["string", "number"].includes(typeof request?.id)) {
				throw new InvalidRequestError("Request 'id' property should be a string, or a number");
			}
			if (typeof request?.id === "number") {
				if (!Number.isInteger(request?.id)) {
					throw new InvalidRequestError("Request 'id' should not contain fractional parts");
				}
			}
			if (typeof request?.id === "string") {
				if (!request?.id.length) {
					throw new InvalidRequestError("Request 'id' should not be an empty string");
				}
			}
		}
		if (typeof request?.method !== "string") {
			throw new InvalidRequestError("Request 'method' property should be a string");
		}
		if (/^rpc\..*/.test(request?.method)) {
			throw new InvalidRequestError("Method cannot start with 'rpc.'");
		}
		if (request?.params !== undefined) {
			if (typeof request?.params !== "object" || request?.params === null) {
				throw new InvalidRequestError("Request 'params' property should be an object, or an array");
			}
		}
	}

	static isRequest(request: Request): boolean {
		if (!request || typeof request !== "object" || Array.isArray(request)) {
			return false;
		}
		const { jsonrpc, method, id, params } = request;
		if (params && (!Array.isArray(params) || typeof params !== "object")) {
			return false;
		}
		return !!(jsonrpc && method && id);
	}
}
