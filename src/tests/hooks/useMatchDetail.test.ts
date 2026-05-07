import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useMatchDetail } from "../../hooks/useMatchDetail";
import { createWrapper } from "../test-utils";

describe("useMatchDetail", () => {
  it("fetches a match by id", async () => {
    const { result } = renderHook(() => useMatchDetail(1), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.notFound).toBe(false);
    expect(result.current.data).not.toBeNull();
    expect(result.current.data!.id).toBe("1");
    expect(result.current.data!.homeTeam.name).toBe("Real Madrid");
  });

  it("returns notFound for null id", () => {
    const { result } = renderHook(() => useMatchDetail(null), {
      wrapper: createWrapper(),
    });

    expect(result.current.notFound).toBe(true);
    expect(result.current.data).toBeNull();
  });

  it("returns notFound for non-existent id", async () => {
    const { result } = renderHook(() => useMatchDetail(999), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.notFound).toBe(true);
  });
});
