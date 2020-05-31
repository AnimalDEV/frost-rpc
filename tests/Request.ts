/* eslint-disable @typescript-eslint/ban-ts-comment */

import {
	InvalidVersionError,
	Request,
	ParseError,
	RpcError,
	InvalidRequestError
} from "../src";
import * as assert from "assert";

describe("Request tests", () => {
	describe("parse tests", () => {
		it("should return single Request object with ParseError when JSON is invalid", function() {
			const invalidJson = "foo";
			const request = Request.parse(invalidJson) as Request;
			assert.deepStrictEqual(Array.isArray(request), false);
			assert.deepStrictEqual(request.error instanceof ParseError, true);
		});

		it("should return Request with error when validation fails", function() {
			const request = Request.parse("{\"json\": \"2.0\", \"id\": null}") as Request;
			assert.deepStrictEqual(request.error instanceof RpcError, true);
		});

		it("should return Request without error when validation passes", function() {
			const request = Request.parse(
				"{\"jsonrpc\": \"2.0\", \"method\": \"foo\"}"
			) as Request;
			assert.deepStrictEqual(request.error, undefined);
		});

		it("should return array of two Request object without errors when called with valid requests", function() {
			const requests = Request.parse(
				"[{\"jsonrpc\": \"2.0\", \"method\": \"foo\"}, {\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"bar\"}]"
			) as Request[];
			assert.deepStrictEqual(Array.isArray(requests), true);
			assert.deepStrictEqual(requests.length === 2, true);
			const errors = [];
			for (const request of requests) {
				if (request.error) {
					errors.push(request.error);
				}
			}
			assert.deepStrictEqual(errors, []);
		});

		it("should return array of two Request object with errors when called with invalid requests", function() {
			const requests = Request.parse(
				"[{\"jsonrpc\": \"2.0\", \"method\": \"rpc.foo\"}, {\"jsonrpc\": \"2.0\", \"id\": 1.23, \"method\": \"bar\"}]"
			) as Request[];
			assert.deepStrictEqual(Array.isArray(requests), true);
			assert.deepStrictEqual(requests.length === 2, true);
			const errors_data = [];
			for (const request of requests) {
				if (request.error) {
					errors_data.push(request.error.data);
				}
			}
			assert.deepStrictEqual(errors_data, [
				"Method cannot start with 'rpc.'",
				"Request 'id' should not contain fractional parts"
			]);
		});

		it("should return array of three Request object with second having error", function() {
			const requests = Request.parse(
				"[{\"jsonrpc\": \"2.0\", \"method\": \"foo\"}, {\"jsonrpc\": \"1.0\", \"method\": \"foo\"}, {\"jsonrpc\": \"2.0\", \"id\": 1, \"method\": \"bar\"}]"
			) as Request[];
			assert.deepStrictEqual(Array.isArray(requests), true);
			assert.deepStrictEqual(requests.length === 3, true);
			const errors_data = requests.map((request) => request.error?.data);
			assert.deepStrictEqual(errors_data, [
				undefined,
				"Version used should be 2.0",
				undefined
			]);
		});
	});
	describe("validateRequest test", () => {
		it("should return InvalidRequestError with data 'Request should be an object' when called with value other than object", function() {
			[1, [], "foo", undefined, null, false, true].forEach((invalidValue) => {
				// @ts-ignore
				const error = Request.validateRequest(invalidValue) as RpcError;
				assert.deepStrictEqual(error instanceof InvalidRequestError, true);
				assert.deepStrictEqual(error.data, "Request should be an object");
			});
		});

		it("should return InvalidRequestError with data `Missing 'jsonrpc' property` when called without jsonrpc property", function() {
			// @ts-ignore
			const error = Request.validateRequest({}) as RpcError;
			assert.deepStrictEqual(error instanceof InvalidRequestError, true);
			assert.deepStrictEqual(error.data, "Missing 'jsonrpc' property");
		});

		it("should return InvalidRequestError with data `Request 'jsonrpc' property should be a string` when called with jsonrpc property value other than string", function() {
			[1, [], {}, null, false, true].forEach((invalidValue) => {
				// @ts-ignore
				const error = Request.validateRequest({
					jsonrpc: invalidValue
				}) as RpcError;
				assert.deepStrictEqual(error instanceof InvalidRequestError, true);
				assert.deepStrictEqual(
					error.data,
					"Request 'jsonrpc' property should be a string"
				);
			});
		});

		it("should return InvalidVersionError with data `Version used should be 2.0` when called with jsonrpc property other than '2.0'", function() {
			// @ts-ignore
			const error = Request.validateRequest({ jsonrpc: "1.0" }) as RpcError;
			assert.deepStrictEqual(error instanceof InvalidVersionError, true);
			assert.deepStrictEqual(error.data, "Version used should be 2.0");
		});

		it("should return InvalidRequestError with data `Request 'id' property should be a string, or a number` when called with invalid id property", function() {
			[[], {}, null, false, true].forEach((invalidValue) => {
				// @ts-ignore
				const error = Request.validateRequest({
					jsonrpc: "2.0",
					id: invalidValue
				}) as RpcError;
				assert.deepStrictEqual(error instanceof InvalidRequestError, true);
				assert.deepStrictEqual(
					error.data,
					"Request 'id' property should be a string, or a number"
				);
			});
		});

		it("should return InvalidRequestError with data `Request 'id' should not be an empty string` when called with id property with empty string", function() {
			// @ts-ignore
			const error = Request.validateRequest({
				jsonrpc: "2.0",
				id: ""
			}) as RpcError;
			assert.deepStrictEqual(error instanceof InvalidRequestError, true);
			assert.deepStrictEqual(
				error.data,
				"Request 'id' should not be an empty string"
			);
		});

		it("should return InvalidRequestError with data `Request 'id' should not contain fractional parts` when called with id property with number containing fractional parts", function() {
			// @ts-ignore
			const error = Request.validateRequest({
				jsonrpc: "2.0",
				id: 2.43
			}) as RpcError;
			assert.deepStrictEqual(error instanceof InvalidRequestError, true);
			assert.deepStrictEqual(
				error.data,
				"Request 'id' should not contain fractional parts"
			);
		});

		it("should return InvalidRequestError with data `Missing 'method' property` when called without method property", function() {
			// @ts-ignore
			const error = Request.validateRequest({
				jsonrpc: "2.0",
				id: 1
			}) as RpcError;
			assert.deepStrictEqual(error instanceof InvalidRequestError, true);
			assert.deepStrictEqual(error.data, "Missing 'method' property");
		});

		it("should return InvalidRequestError with data `Request 'method' property should be a string` when called with invalid method property", function() {
			[1, [], {}, null, false, true].forEach((invalidValue) => {
				// @ts-ignore
				const error = Request.validateRequest({
					jsonrpc: "2.0",
					id: 1,
					method: invalidValue
				}) as RpcError;
				assert.deepStrictEqual(error instanceof InvalidRequestError, true);
				assert.deepStrictEqual(
					error.data,
					"Request 'method' property should be a string"
				);
			});
		});

		it("should return InvalidRequestError with data `Method cannot start with 'rpc.'` when called with method property that starts with 'rpc.'", function() {
			const error = Request.validateRequest({
				jsonrpc: "2.0",
				id: 1,
				method: "rpc.foo"
			}) as RpcError;
			assert.deepStrictEqual(error instanceof InvalidRequestError, true);
			assert.deepStrictEqual(error.data, "Method cannot start with 'rpc.'");
		});

		it("should return InvalidRequestError with data `Request 'params' property should be an object, or an array` when called with invalid params property", function() {
			[1, "foo", null, false, true].forEach((invalidValue) => {
				// @ts-ignore
				const error = Request.validateRequest({
					jsonrpc: "2.0",
					id: 1,
					method: "foo",
					params: invalidValue
				}) as RpcError;
				assert.deepStrictEqual(error instanceof InvalidRequestError, true);
				assert.deepStrictEqual(
					error.data,
					"Request 'params' property should be an object, or an array"
				);
			});
		});

		it("should return false when called with proper request object", function() {
			const result = Request.validateRequest({
				jsonrpc: "2.0",
				id: 1,
				method: "foo",
				params: []
			});
			assert.deepStrictEqual(result, false);
		});

		it("should return false without id", function() {
			const result = Request.validateRequest({
				jsonrpc: "2.0",
				method: "foo",
				params: []
			});
			assert.deepStrictEqual(result, false);
		});

		it("should return false without params", function() {
			const result = Request.validateRequest({
				jsonrpc: "2.0",
				id: 1,
				method: "foo"
			});
			assert.deepStrictEqual(result, false);
		});

		it("should return false when called with string id param", function() {
			const result = Request.validateRequest({
				jsonrpc: "2.0",
				id: "foo",
				method: "bar"
			});
			assert.deepStrictEqual(result, false);
		});
	});
	describe("Constructor tests", () => {
		it("should set null to id property when invalid id param", function() {
			[{}, [], undefined, null, true, false].forEach((invalidId) => {
				// @ts-ignore
				const request = new Request("foo", invalidId);
				assert.deepStrictEqual(request.id, null);
			});
		});

		it("should set id proper property value when valid id param", function() {
			["foo", 1].forEach((id) => {
				const request = new Request("foo", id);
				assert.deepStrictEqual(request.id, id);
			});
		});
	});
});
