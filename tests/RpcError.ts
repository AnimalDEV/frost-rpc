import {
	RpcError,
	ParseError,
	MissingMethodError,
	InvalidVersionError,
	InvalidRequestError,
	InvalidParams,
	InternalError
} from "../src";
import * as assert from "assert";

describe("Request tests", () => {
	describe("RpcError tests", () => {
		it("should be instance of Error", function() {
			const error = new RpcError(12, "foo");
			assert.deepStrictEqual(error instanceof Error, true);
		});
	});
	describe("ParseError tests", () => {
		it("should be instanceof RpcError", function() {
			const error = new ParseError();
			assert.deepStrictEqual(error instanceof RpcError, true);
		});

		it("should have message 'ParseError'", function() {
			const error = new ParseError();
			assert.deepStrictEqual(error.message, "Parse error");
		});

		it("should have code -32700", function() {
			const error = new ParseError();
			assert.deepStrictEqual(error.code, -32700);
		});

		it("should have name 'ParseError'", function() {
			const error = new ParseError();
			assert.deepStrictEqual(error.name, "ParseError");
		});

		it("should have data 'foo'", function() {
			const error = new ParseError("foo");
			assert.deepStrictEqual(error.data, "foo");
		});
	});
	describe("MissingMethodError tests", () => {
		it("should be instanceof RpcError", function() {
			const error = new MissingMethodError();
			assert.deepStrictEqual(error instanceof RpcError, true);
		});

		it("should have message 'MissingMethodError'", function() {
			const error = new MissingMethodError();
			assert.deepStrictEqual(error.message, "Method not found");
		});

		it("should have code -32601", function() {
			const error = new MissingMethodError();
			assert.deepStrictEqual(error.code, -32601);
		});

		it("should have name 'MissingMethodError'", function() {
			const error = new MissingMethodError();
			assert.deepStrictEqual(error.name, "MissingMethodError");
		});

		it("should have data 'foo'", function() {
			const error = new MissingMethodError("foo");
			assert.deepStrictEqual(error.data, "foo");
		});
	});
	describe("InvalidVersionError tests", () => {
		it("should be instanceof RpcError", function() {
			const error = new InvalidVersionError();
			assert.deepStrictEqual(error instanceof RpcError, true);
		});

		it("should have message 'InvalidVersionError'", function() {
			const error = new InvalidVersionError();
			assert.deepStrictEqual(error.message, "Invalid JSON-RPC version");
		});

		it("should have code -32099", function() {
			const error = new InvalidVersionError();
			assert.deepStrictEqual(error.code, -32099);
		});

		it("should have name 'InvalidVersionError'", function() {
			const error = new InvalidVersionError();
			assert.deepStrictEqual(error.name, "InvalidVersionError");
		});

		it("should have data 'foo'", function() {
			const error = new InvalidVersionError("foo");
			assert.deepStrictEqual(error.data, "foo");
		});
	});
	describe("InvalidRequestError tests", () => {
		it("should be instanceof RpcError", function() {
			const error = new InvalidRequestError();
			assert.deepStrictEqual(error instanceof RpcError, true);
		});

		it("should have message 'InvalidRequestError'", function() {
			const error = new InvalidRequestError();
			assert.deepStrictEqual(error.message, "Invalid Request");
		});

		it("should have code -32600", function() {
			const error = new InvalidRequestError();
			assert.deepStrictEqual(error.code, -32600);
		});

		it("should have name 'InvalidRequestError'", function() {
			const error = new InvalidRequestError();
			assert.deepStrictEqual(error.name, "InvalidRequestError");
		});

		it("should have data 'foo'", function() {
			const error = new InvalidRequestError("foo");
			assert.deepStrictEqual(error.data, "foo");
		});
	});
	describe("InvalidParams tests", () => {
		it("should be instanceof RpcError", function() {
			const error = new InvalidParams();
			assert.deepStrictEqual(error instanceof RpcError, true);
		});

		it("should have message 'InvalidParams'", function() {
			const error = new InvalidParams();
			assert.deepStrictEqual(error.message, "Invalid params");
		});

		it("should have code -32602", function() {
			const error = new InvalidParams();
			assert.deepStrictEqual(error.code, -32602);
		});

		it("should have name 'InvalidParams'", function() {
			const error = new InvalidParams();
			assert.deepStrictEqual(error.name, "InvalidParams");
		});

		it("should have data 'foo'", function() {
			const error = new InvalidParams("foo");
			assert.deepStrictEqual(error.data, "foo");
		});
	});
	describe("InternalError tests", () => {
		it("should be instanceof RpcError", function() {
			const error = new InternalError();
			assert.deepStrictEqual(error instanceof RpcError, true);
		});

		it("should have message 'InvalidParams'", function() {
			const error = new InternalError();
			assert.deepStrictEqual(error.message, "Internal error");
		});

		it("should have code -32603", function() {
			const error = new InternalError();
			assert.deepStrictEqual(error.code, -32603);
		});

		it("should have name 'InternalError'", function() {
			const error = new InternalError();
			assert.deepStrictEqual(error.name, "InternalError");
		});

		it("should have data 'foo'", function() {
			const error = new InternalError("foo");
			assert.deepStrictEqual(error.data, "foo");
		});
	});
});
