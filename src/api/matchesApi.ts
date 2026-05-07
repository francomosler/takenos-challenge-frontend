import { apiFetch, buildQueryString, type QueryValue } from "./client";
import type { Match, MatchesFilters, SearchMatchesResponse } from "../types/api";

export async function getMatches(
  filters: MatchesFilters = {},
  signal?: AbortSignal
): Promise<SearchMatchesResponse> {
  const qs = buildQueryString(filters as Record<string, QueryValue>);
  return apiFetch<SearchMatchesResponse>(`/matches${qs}`, { signal });
}

export async function getMatchById(id: number, signal?: AbortSignal): Promise<Match> {
  return apiFetch<Match>(`/matches/${id}`, { signal });
}
