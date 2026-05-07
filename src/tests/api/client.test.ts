import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { ApiError, apiFetch, buildQueryString } from "../../api/client";

describe("buildQueryString", () => {
  it("ignores undefined / null / empty values", () => {
    const qs = buildQueryString({
      a: 1,
      b: undefined,
      c: null,
      d: "",
      e: "x",
    });
    expect(qs).toBe("?a=1&e=x");
  });

  it("returns empty string when all values are empty", () => {
    expect(buildQueryString({ a: undefined, b: null })).toBe("");
  });

  it("converts booleans and numbers to strings", () => {
    const qs = buildQueryString({ page: 2, active: true });
    expect(qs).toBe("?page=2&active=true");
  });
});

describe("apiFetch", () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("parses JSON response on success", async () => {
    const data = { id: 1, name: "test" };
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify(data), {
        status: 200,
        headers: { "content-type": "application/json" },
      })
    );

    const result = await apiFetch("/test");
    expect(result).toEqual(data);
  });

  it("throws ApiError with message from JSON body", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response(JSON.stringify({ message: "Not found" }), {
        status: 404,
        headers: { "content-type": "application/json" },
      })
    );

    try {
      await apiFetch("/test");
      expect.fail("should have thrown");
    } catch (err) {
      expect(err).toBeInstanceOf(ApiError);
      expect((err as ApiError).status).toBe(404);
      expect((err as ApiError).message).toBe("Not found");
    }
  });

  it("handles plain text error responses", async () => {
    vi.mocked(fetch).mockResolvedValue(
      new Response("Draw already exists", {
        status: 409,
        headers: { "content-type": "text/plain" },
      })
    );

    await expect(apiFetch("/draw")).rejects.toThrow("Draw already exists");
  });

  it("returns null when expectJson is false", async () => {
    vi.mocked(fetch).mockResolvedValue(new Response(null, { status: 201 }));

    const result = await apiFetch("/draw", {
      method: "POST",
      expectJson: false,
    });
    expect(result).toBeNull();
  });
});
