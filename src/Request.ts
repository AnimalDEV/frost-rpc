import { RpcError } from "./RpcError";
import { ParseError } from "./RpcError";
import { InvalidRequestError } from "./RpcError";
import { InvalidVersionError } from "./RpcError";

export class Request {
	jsonrpc: string;
	id: number | string | null;
	method?: string;
	params?: Array<unknown> | { [key: string]: unknown };
	error?: RpcError;

	constructor(method?: string, id?: number | string | null, params?: Array<unknown> | { [key: string]: unknown }, error?: RpcError) {
		this.jsonrpc = "2.0";
		this.id = typeof id === "number" || typeof id === "string" ? id : null;
		this.method = method;
		this.params = params;
		this.error = error;
	}

	static validateRequest(req: { [key: string]: unknown }): RpcError | false {
		const isObject = typeof req === "object" && req !== null && !Array.isArray(req);
		if (!isObject) {
			return new InvalidRequestError("Request should be an object");
		}
		if (req?.jsonrpc === undefined) {
			return new InvalidRequestError("Missing 'jsonrpc' property");
		}
		if (typeof req?.jsonrpc !== "string") {
			return new InvalidRequestError("Request 'jsonrpc' property should be a string");
		}
		if (req?.jsonrpc !== "2.0") {
			return new InvalidVersionError("Version used should be 2.0");
		}
		if (req?.id !== undefined) {
			if (typeof req?.id !== "string" && typeof req?.id !== "number") {
				return new InvalidRequestError("Request 'id' property should be a string, or a number");
			}
			if (typeof req?.id === "number") {
				if (!Number.isInteger(req?.id)) {
					return new InvalidRequestError("Request 'id' should not contain fractional parts");
				}
			}
			if (typeof req?.id === "string") {
				if (!req?.id.length) {
					return new InvalidRequestError("Request 'id' should not be an empty string");
				}
			}
		}
		if (req?.method === undefined) {
			return new InvalidRequestError("Missing 'method' property");
		}
		if (typeof req?.method !== "string") {
			return new InvalidRequestError("Request 'method' property should be a string");
		}
		if (/^rpc\..*/.test(req?.method)) {
			return new InvalidRequestError("Method cannot start with 'rpc.'");
		}
		if (req?.params !== undefined) {
			if (typeof req?.params !== "object" || req?.params === null) {
				return new InvalidRequestError("Request 'params' property should be an object, or an array");
			}
		}
		return false;
	}

	static parse(text: string): Request | Request[] {
		let req;
		try {
			req = JSON.parse(text);
		} catch (e) {
			return new Request(undefined, null, undefined, new ParseError(e.message));
		}
		if (Array.isArray(req)) {
			return req.map((single_req) => {
				const error = this.validateRequest(single_req);
				if (error) {
					return new Request(single_req.method, single_req.id, single_req.params, error);
				}
				return new Request(single_req.method, single_req.id, single_req.params);
			});
		}
		const error = this.validateRequest(req);
		if (error) {
			return new Request(req.method, req.id, req.params, error);
		}
		return new Request(req.method, req.id, req.params);
	}
}
