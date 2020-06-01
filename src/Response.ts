import { InvalidRequestError, InvalidVersionError, RpcError } from "./index";

export class Response {
	jsonrpc: string;
	id: number | string | null;
	result?: unknown;
	error?: RpcError;

	constructor(id: number | string | null, result?: unknown, error?: RpcError) {
		this.jsonrpc = "2.0";
		this.id = id;
		this.result = result;
		this.error = error;
	}

	static validateResponse(response: Response): void {
		const isObject = typeof response === "object" && response != null && !Array.isArray(response);
		if (!isObject) {
			throw new InvalidRequestError("Response should be an object");
		}
		if (response?.jsonrpc !== "2.0") {
			throw new InvalidVersionError("JSONRPC version property should be 2.0");
		}
		if(response?.result && response?.error) {
			throw new InvalidRequestError("Result and error cannot be returned together");
		}
		if(!response?.result && !response?.error) {
			throw new InvalidRequestError("Missing result or error");
		}
		if(response?.error && !RpcError.isError(response?.error)) {
			throw new InvalidRequestError("Invalid error structure");
		}
	}

	static isResponse(response: Response): boolean {
		if(!response || typeof response !== "object" || Array.isArray(response)) {
			return false;
		}
		const {jsonrpc, result, error, id} = response;
		if(result && error) {
			return false;
		}
		if(!result && !error) {
			return false;
		}
		if(error && !RpcError.isError(error)) {
			return false;
		}
		return !!(jsonrpc && id);
	}
}
