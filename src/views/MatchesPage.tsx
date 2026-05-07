"use client";

import { SegmentedControl, Stack } from "@mantine/core";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { MatchFilters } from "../components/matches/MatchFilters";
import { MatchPagination } from "../components/matches/MatchPagination";
import { MatchTable } from "../components/matches/MatchTable";
import { useMatches } from "../hooks/useMatches";
import { useMatchesFilters } from "../hooks/useMatchesFilters";
import { useTeams } from "../hooks/useTeams";
import { filterBySide } from "../utils/filters";
import type { MatchSide } from "../types/api";

export function MatchesPage() {
  const { filters, side, updateFilters, clear } = useMatchesFilters();
  const { data, loading, error, refresh } = useMatches(filters);
  const { data: teams, loading: teamsLoading } = useTeams();

  const hasActiveFilters = !!(
    filters.teamId ||
    filters.countryId ||
    filters.sortBy ||
    filters.sortOrder
  );

  const displayMatches =
    data && side !== "all" && filters.teamId
      ? filterBySide(data.matches, filters.teamId, side)
      : (data?.matches ?? []);

  return (
    <Stack gap="lg">
      <PageHeader
        title="Partidos"
        subtitle="Listado de todos los partidos del sorteo actual."
      />

      <MatchFilters
        teams={teams}
        teamsLoading={teamsLoading}
        selectedTeamId={filters.teamId}
        selectedCountryId={filters.countryId}
        selectedSortBy={filters.sortBy}
        selectedSortOrder={filters.sortOrder}
        onTeamChange={(v) => updateFilters({ teamId: v }, { resetPage: true })}
        onCountryChange={(v) => updateFilters({ countryId: v }, { resetPage: true })}
        onSortByChange={(v) => updateFilters({ sortBy: v })}
        onSortOrderChange={(v) => updateFilters({ sortOrder: v })}
        onClear={clear}
        hasActiveFilters={hasActiveFilters}
      />

      {filters.teamId && (
        <SegmentedControl
          value={side}
          onChange={(v) => updateFilters({ side: v as MatchSide })}
          data={[
            { value: "all", label: "Todos" },
            { value: "home", label: "Local" },
            { value: "away", label: "Visitante" },
          ]}
        />
      )}

      {loading && <LoadingState label="Cargando partidos..." />}

      {!loading && error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && !error && displayMatches.length === 0 && (
        <EmptyState
          title="Sin partidos"
          description={
            hasActiveFilters
              ? "No hay partidos para estos filtros. Probá ajustarlos."
              : "No hay partidos cargados. ¿Hay un sorteo activo?"
          }
          actionLabel={hasActiveFilters ? "Limpiar filtros" : undefined}
          onAction={hasActiveFilters ? clear : undefined}
        />
      )}

      {!loading && !error && displayMatches.length > 0 && (
        <>
          <MatchTable matches={displayMatches} highlightTeamId={filters.teamId} />
          {data?.pagination && (
            <MatchPagination
              pagination={data.pagination}
              onPageChange={(p) => updateFilters({ page: p })}
            />
          )}
        </>
      )}
    </Stack>
  );
}
