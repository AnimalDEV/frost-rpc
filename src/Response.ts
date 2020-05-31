import { RpcError } from "./index";
import { Request } from "./Request";

export class Response {
	jsonrpc: string;
	id?: number | string | null;
	result?: unknown;
	error?: RpcError;

	constructor(id: number | string | null, result?: unknown, error?: RpcError) {
		this.jsonrpc = "2.0";
		this.id = id;
		this.result = result;
		this.error = error;
	}

	static fromRequest(request: Request): Response {
		const { id, error } = request;
		if (error) {
			return this.withError(error, id);
		}
		return new Response(id, undefined);
	}

	static withError(error: RpcError, id: number | string | null = null): Response {
		return new Response(id, undefined, error);
	}
}
