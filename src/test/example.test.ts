import { describe, it, expect } from "vitest";
import { normalizeBooleanValue } from "@/hooks/useExamResults";

describe("normalizeBooleanValue", () => {
  it("should treat 1, true and passed strings as true", () => {
    expect(normalizeBooleanValue(1)).toBe(true);
    expect(normalizeBooleanValue("1")).toBe(true);
    expect(normalizeBooleanValue("true")).toBe(true);
    expect(normalizeBooleanValue("passed")).toBe(true);
  });

  it("should treat 0, false and failed strings as false", () => {
    expect(normalizeBooleanValue(0)).toBe(false);
    expect(normalizeBooleanValue("0")).toBe(false);
    expect(normalizeBooleanValue("false")).toBe(false);
    expect(normalizeBooleanValue("failed")).toBe(false);
  });

  it("should return null for unknown values", () => {
    expect(normalizeBooleanValue(null)).toBe(null);
    expect(normalizeBooleanValue("maybe")).toBe(null);
  });
});
