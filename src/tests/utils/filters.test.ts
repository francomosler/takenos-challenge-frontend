import { describe, expect, it } from "vitest";
import { filterBySide, groupByMatchDay } from "../../utils/filters";
import type { Match } from "../../types/api";

const mockMatch = (
  id: string,
  homeId: number,
  awayId: number,
  matchDay: number
): Match => ({
  id,
  homeTeam: { id: homeId, name: `Team ${homeId}`, country: { id: 1, name: "ES" } },
  awayTeam: { id: awayId, name: `Team ${awayId}`, country: { id: 2, name: "EN" } },
  matchDay,
});

describe("filterBySide", () => {
  const matches = [
    mockMatch("1", 10, 20, 1),
    mockMatch("2", 20, 10, 2),
    mockMatch("3", 30, 10, 3),
  ];

  it("returns all matches when side is 'all'", () => {
    expect(filterBySide(matches, 10, "all")).toHaveLength(3);
  });

  it("returns only home matches", () => {
    const result = filterBySide(matches, 10, "home");
    expect(result).toHaveLength(1);
    expect(result[0].id).toBe("1");
  });

  it("returns only away matches", () => {
    const result = filterBySide(matches, 10, "away");
    expect(result).toHaveLength(2);
    expect(result[0].id).toBe("2");
    expect(result[1].id).toBe("3");
  });

  it("returns empty array if teamId has no matches in that side", () => {
    expect(filterBySide(matches, 99, "home")).toHaveLength(0);
  });
});

describe("groupByMatchDay", () => {
  const matches = [
    mockMatch("1", 10, 20, 1),
    mockMatch("2", 30, 40, 1),
    mockMatch("3", 10, 30, 2),
    mockMatch("4", 20, 40, 3),
  ];

  it("groups matches by matchDay", () => {
    const grouped = groupByMatchDay(matches);
    expect(grouped.size).toBe(3);
    expect(grouped.get(1)).toHaveLength(2);
    expect(grouped.get(2)).toHaveLength(1);
    expect(grouped.get(3)).toHaveLength(1);
  });

  it("returns empty map for empty array", () => {
    const grouped = groupByMatchDay([]);
    expect(grouped.size).toBe(0);
  });

  it("preserves order within each group", () => {
    const grouped = groupByMatchDay(matches);
    const day1 = grouped.get(1)!;
    expect(day1[0].id).toBe("1");
    expect(day1[1].id).toBe("2");
  });
});
