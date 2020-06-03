import { Parser, DefaultParser } from "./Parser";
import {Request} from "./Request";
import { InvalidRequestError, ParseError } from "./RpcError";
import {Notification} from "./Notification";
import {Response} from "./Response";

interface RpcOptions {
	parser: Parser
}

export class FrostRpc {
	#parser: Parser;

	constructor(options?: RpcOptions) {
		this.#parser = options?.parser ?? new DefaultParser();
	}

	set parser(value: Parser) {
		this.#parser = value;
	}

	static getRpcObject(data: Request | Response | Notification ): Request | Response | Notification {
		if(Notification.isNotification(data as Notification)) {
			Notification.validateNotification(data as Notification);
			const {method, params} = data as Notification;
			return new Notification(method, params);
		}
		if(Request.isRequest(data as Request)) {
			Request.validateRequest(data as Request);
			const {id, method, params} = data as Request;
			return new Request(id, method, params);
		}
		if(Response.isResponse(data as Response)) {
			Response.validateResponse(data as Response);
			const {id, result, error} = data as Response;
			return new Response(id, result, error);
		}
		throw new InvalidRequestError();
	}

	parse(text: string): Request | Response | Notification | (Request|Response|Notification)[] {
		let parsed;
		try {
			parsed = JSON.parse(text, this.#parser.reviver);
		} catch (e) {
			throw new ParseError(e.message);
		}
		if(typeof parsed !== "object" && parsed == null) {
			throw new InvalidRequestError();
		}
		try {
			return FrostRpc.getRpcObject(parsed);
		} catch (e) {
			throw new InvalidRequestError();
		}
	}
}
