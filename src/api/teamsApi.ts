import { apiFetch, buildQueryString, type QueryValue } from "./client";
import type { SearchTeamsResponse, TeamDetailResponse, TeamsFilters } from "../types/api";

export async function getTeams(
  filters: TeamsFilters = {},
  signal?: AbortSignal
): Promise<SearchTeamsResponse> {
  const qs = buildQueryString(filters as Record<string, QueryValue>);
  return apiFetch<SearchTeamsResponse>(`/teams${qs}`, { signal });
}

export async function getTeamById(
  id: number,
  signal?: AbortSignal
): Promise<TeamDetailResponse> {
  return apiFetch<TeamDetailResponse>(`/teams/${id}`, { signal });
}
