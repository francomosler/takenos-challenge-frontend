import { describe, expect, it } from "vitest";
import {
  formatMatchDay,
  formatTeamName,
  formatCreatedAt,
  formatApiError,
} from "../../utils/formatters";

describe("formatMatchDay", () => {
  it("formats matchday number to readable string", () => {
    expect(formatMatchDay(1)).toBe("Jornada 1");
    expect(formatMatchDay(8)).toBe("Jornada 8");
  });
});

describe("formatTeamName", () => {
  it("combines name and country", () => {
    expect(formatTeamName("Real Madrid", "España")).toBe("Real Madrid (España)");
  });
});

describe("formatCreatedAt", () => {
  it("formats ISO date string to DD/MM/YYYY HH:mm", () => {
    const result = formatCreatedAt("2025-03-15T10:30:00.000Z");
    expect(result).toMatch(/15\/03\/2025/);
  });
});

describe("formatApiError", () => {
  it("extracts message from Error instances", () => {
    expect(formatApiError(new Error("something broke"))).toBe("something broke");
  });

  it("returns string errors directly", () => {
    expect(formatApiError("network down")).toBe("network down");
  });

  it("returns fallback for unknown types", () => {
    expect(formatApiError(42)).toBe("Error desconocido");
    expect(formatApiError(null)).toBe("Error desconocido");
  });
});
