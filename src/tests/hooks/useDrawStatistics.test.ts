import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useDrawStatistics } from "../../hooks/useDrawStatistics";
import { createWrapper } from "../test-utils";

describe("useDrawStatistics", () => {
  it("fetches draw statistics", async () => {
    const { result } = renderHook(() => useDrawStatistics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.notFound).toBe(false);
    expect(result.current.data).not.toBeNull();
    expect(result.current.data!.totalTeams).toBe(4);
    expect(result.current.data!.totalMatches).toBe(4);
  });

  it("handles 404 as notFound", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("../mocks/server");
    server.use(
      http.get("http://localhost:8000/draw/statistics", () => {
        return HttpResponse.json({ message: "Not found" }, { status: 404 });
      })
    );

    const { result } = renderHook(() => useDrawStatistics(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notFound).toBe(true);
    expect(result.current.error).toBeNull();
  });
});
