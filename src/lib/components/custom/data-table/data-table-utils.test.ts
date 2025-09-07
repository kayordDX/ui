/// <reference types="vitest" />

import { describe, it, expect } from "vitest";
import { sum, min, max, uniqueCount, count, mean } from "./data-table-utils";

describe("data-table-utils", () => {
	const data = [
		{ a: 1, b: 10 },
		{ a: 2, b: 20 },
		{ a: 3, b: 10 },
	];

	it("sum returns the sum of a column", () => {
		expect(sum(data, "a")).toBe(6);
		expect(sum(data, "b")).toBe(40);
		expect(sum([], "a")).toBe(0);
	});

	it("min returns the minimum value of a column", () => {
		expect(min(data, "a")).toBe(1);
		expect(min(data, "b")).toBe(10);
		expect(min([], "a")).toBe(undefined);
	});

	it("max returns the maximum value of a column", () => {
		expect(max(data, "a")).toBe(3);
		expect(max(data, "b")).toBe(20);
		expect(max([], "a")).toBe(undefined);
	});

	it("uniqueCount returns the number of unique values in a column", () => {
		expect(uniqueCount(data, "a")).toBe(3);
		expect(uniqueCount(data, "b")).toBe(2);
		expect(uniqueCount([], "a")).toBe(0);
	});

	it("count returns the length of the array", () => {
		expect(count(data, "a")).toBe(3);
		expect(count([], "a")).toBe(0);
	});

	it("mean returns the average value of a column", () => {
		expect(mean(data, "a")).toBe(2);
		expect(mean(data, "b")).toBeCloseTo(13.333, 2);
		expect(mean([], "a")).toBeUndefined();
	});
});
