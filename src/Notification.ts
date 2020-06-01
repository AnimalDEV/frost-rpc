import { InvalidRequestError } from "./RpcError";
import { InvalidVersionError } from "./RpcError";

export class Notification {
	jsonrpc: string;
	method: string;
	params?: Array<unknown> | { [key: string]: unknown };

	constructor(method: string, params?: Array<unknown> | { [key: string]: unknown }) {
		this.jsonrpc = "2.0";
		this.method = method;
		this.params = params;
	}

	static validateNotification(notification: Notification): void {
		const isObject = typeof notification === "object" && notification != null && !Array.isArray(notification);
		if (!isObject) {
			throw new InvalidRequestError("Notification should be an object");
		}
		if (notification?.jsonrpc !== "2.0") {
			throw new InvalidVersionError("JSONRPC version property should be 2.0");
		}
		if (typeof notification?.method !== "string") {
			throw new InvalidRequestError("Request 'method' property should be a string");
		}
		if (/^rpc\..*/.test(notification?.method)) {
			throw new InvalidRequestError("Method cannot start with 'rpc.'");
		}
		if (notification?.params !== undefined) {
			if (typeof notification?.params !== "object" || notification?.params === null) {
				throw new InvalidRequestError("Request 'params' property should be an object, or an array");
			}
		}
	}

	static isNotification(notification: Notification): boolean {
		if(!notification || typeof notification !== "object" || Array.isArray(notification)) {
			return false;
		}
		const {jsonrpc, method, params} = notification;
		if(params && (!Array.isArray(params) || typeof params !== "object")) {
			return false;
		}
		return !!(jsonrpc && method);
	}
}
