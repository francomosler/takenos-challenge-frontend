import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMatches } from "../../hooks/useMatches";
import { createWrapper } from "../test-utils";

describe("useMatches", () => {
  it("fetches matches with default filters", async () => {
    const { result } = renderHook(() => useMatches({}), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data).not.toBeNull();
    expect(result.current.data!.matches).toHaveLength(4);
    expect(result.current.data!.pagination.total).toBe(4);
  });

  it("filters by teamId", async () => {
    const { result } = renderHook(() => useMatches({ teamId: 1 }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data!.matches.length).toBeGreaterThan(0);
    result.current.data!.matches.forEach((m) => {
      expect(
        m.homeTeam.id === 1 || m.awayTeam.id === 1
      ).toBe(true);
    });
  });

  it("returns error on network failure", async () => {
    const { http, HttpResponse } = await import("msw");
    const { server } = await import("../mocks/server");
    server.use(
      http.get("http://localhost:8000/matches", () => {
        return HttpResponse.json({ message: "Server error" }, { status: 500 });
      })
    );

    const { result } = renderHook(() => useMatches({}), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).not.toBeNull();
  });
});
