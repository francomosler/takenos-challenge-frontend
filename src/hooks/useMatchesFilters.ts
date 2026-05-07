"use client";

import { useCallback, useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { MatchSide, MatchSortBy, MatchesFilters, SortOrder } from "../types/api";

const VALID_SORT_BY: MatchSortBy[] = ["matchDay", "id", "homeTeam", "awayTeam"];
const VALID_SIDE: MatchSide[] = ["all", "home", "away"];
const DEFAULT_LIMIT = 12;

const EMPTY_PARAMS = new URLSearchParams();

function parseInt1(value: string | null): number | undefined {
  if (!value) return undefined;
  const n = Number.parseInt(value, 10);
  return Number.isInteger(n) && n >= 1 ? n : undefined;
}

function parseMatchDay(value: string | null): number | undefined {
  const n = parseInt1(value);
  if (!n) return undefined;
  return n >= 1 && n <= 8 ? n : undefined;
}

function parseEnum<T extends string>(value: string | null, allowed: T[]): T | undefined {
  if (!value) return undefined;
  return allowed.includes(value as T) ? (value as T) : undefined;
}

export type ResolvedFilters = {
  filters: MatchesFilters;
  side: MatchSide;
};

export function useMatchesFilters() {
  const searchParams = useSearchParams() ?? EMPTY_PARAMS;
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const resolved = useMemo<ResolvedFilters>(() => {
    const teamId = parseInt1(searchParams.get("teamId"));
    const countryId = parseInt1(searchParams.get("countryId"));
    const matchDay = parseMatchDay(searchParams.get("matchDay"));
    const matchDayFrom = parseMatchDay(searchParams.get("matchDayFrom"));
    const matchDayTo = parseMatchDay(searchParams.get("matchDayTo"));
    const sortBy = parseEnum(searchParams.get("sortBy"), VALID_SORT_BY);
    const sortOrder = parseEnum<SortOrder>(searchParams.get("sortOrder"), [
      "asc",
      "desc",
    ]);
    const page = parseInt1(searchParams.get("page")) ?? 1;
    const limit = parseInt1(searchParams.get("limit")) ?? DEFAULT_LIMIT;
    const side = parseEnum(searchParams.get("side"), VALID_SIDE) ?? "all";

    return {
      filters: {
        teamId,
        countryId,
        matchDay,
        matchDayFrom,
        matchDayTo,
        sortBy,
        sortOrder,
        page,
        limit,
      },
      side,
    };
  }, [searchParams]);

  const updateFilters = useCallback(
    (
      patch: Partial<{
        teamId: number | undefined;
        countryId: number | undefined;
        matchDay: number | undefined;
        matchDayFrom: number | undefined;
        matchDayTo: number | undefined;
        sortBy: MatchSortBy | undefined;
        sortOrder: SortOrder | undefined;
        page: number | undefined;
        limit: number | undefined;
        side: MatchSide;
      }>,
      options?: { resetPage?: boolean }
    ) => {
      const next = new URLSearchParams(searchParams.toString());
      for (const [key, rawValue] of Object.entries(patch)) {
        const value: unknown = rawValue;
        if (value === undefined || value === null || value === "" || value === "all") {
          next.delete(key);
        } else {
          next.set(key, String(value));
        }
      }
      if (options?.resetPage) {
        next.delete("page");
      }
      router.replace(`${pathname}?${next.toString()}`);
    },
    [searchParams, router, pathname]
  );

  const clear = useCallback(() => {
    router.replace(pathname);
  }, [router, pathname]);

  return { ...resolved, updateFilters, clear };
}
