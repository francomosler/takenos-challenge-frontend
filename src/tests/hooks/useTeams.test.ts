import { renderHook, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useTeams } from "../../hooks/useTeams";
import { createWrapper } from "../test-utils";

describe("useTeams", () => {
  it("fetches all teams", async () => {
    const { result } = renderHook(() => useTeams(), {
      wrapper: createWrapper(),
    });

    expect(result.current.loading).toBe(true);

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.error).toBeNull();
    expect(result.current.data).toHaveLength(4);
    expect(result.current.data[0].name).toBe("Real Madrid");
  });
});
