import {
	Response,
	InternalError,
	Request
} from "../src";
import * as assert from "assert";

describe("Request tests", () => {
	describe("fromRequest tests", () => {
		it("should return Response with error when given Request with error", function() {
			const request = new Request("foo", 1, [], new InternalError());
			const response = Response.fromRequest(request);
			assert.deepStrictEqual(response.error instanceof InternalError, true);
		});
		it("should return Response without error when given Request without error", function() {
			const request = new Request("foo", 1, []);
			const response = Response.fromRequest(request);
			assert.deepStrictEqual(response.error, undefined);
		});
	});
	describe("withError tests", () => {
		it("should return Response object with error set", function() {
			const response = Response.withError(new InternalError(), 1);
			assert.deepStrictEqual(response.error instanceof InternalError, true);
		});
		it("should return Response object with id set to null when no id was provided", function() {
			const response = Response.withError(new InternalError());
			assert.deepStrictEqual(response.id, null);
		});
	});
});
