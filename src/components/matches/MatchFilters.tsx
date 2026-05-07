"use client";

import { Button, Group, Paper, Select, Stack } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

import type { MatchSortBy, SortOrder, Team } from "../../types/api";

type Props = {
  teams: Team[];
  teamsLoading: boolean;
  selectedTeamId?: number;
  selectedCountryId?: number;
  selectedSortBy?: MatchSortBy;
  selectedSortOrder?: SortOrder;
  onTeamChange: (teamId: number | undefined) => void;
  onCountryChange: (countryId: number | undefined) => void;
  onSortByChange: (sortBy: MatchSortBy | undefined) => void;
  onSortOrderChange: (sortOrder: SortOrder | undefined) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
};

export function MatchFilters({
  teams,
  teamsLoading,
  selectedTeamId,
  selectedCountryId,
  selectedSortBy,
  selectedSortOrder,
  onTeamChange,
  onCountryChange,
  onSortByChange,
  onSortOrderChange,
  onClear,
  hasActiveFilters,
}: Props) {
  const teamOptions = teams.map((t) => ({
    value: String(t.id),
    label: `${t.name} (${t.country.name})`,
  }));

  const countryOptions = (() => {
    const seen = new Map<number, string>();
    for (const team of teams) {
      if (!seen.has(team.country.id)) {
        seen.set(team.country.id, team.country.name);
      }
    }
    return Array.from(seen.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ value: String(id), label: name }));
  })();

  const sortByOptions = [
    { value: "matchDay", label: "Jornada" },
    { value: "id", label: "ID" },
    { value: "homeTeam", label: "Equipo local" },
    { value: "awayTeam", label: "Equipo visitante" },
  ];

  const sortOrderOptions = [
    { value: "asc", label: "Ascendente" },
    { value: "desc", label: "Descendente" },
  ];

  return (
    <Paper withBorder p="md" radius="md">
      <Stack gap="sm">
        <Group grow align="flex-end" wrap="wrap">
          <Select
            label="Equipo"
            placeholder="Todos"
            data={teamOptions}
            value={selectedTeamId ? String(selectedTeamId) : null}
            onChange={(v) => onTeamChange(v ? Number(v) : undefined)}
            searchable
            clearable
            disabled={teamsLoading}
          />
          <Select
            label="País"
            placeholder="Todos"
            data={countryOptions}
            value={selectedCountryId ? String(selectedCountryId) : null}
            onChange={(v) => onCountryChange(v ? Number(v) : undefined)}
            searchable
            clearable
            disabled={teamsLoading}
          />
          <Select
            label="Ordenar por"
            placeholder="Por defecto"
            data={sortByOptions}
            value={selectedSortBy ?? null}
            onChange={(v) => onSortByChange((v as MatchSortBy) || undefined)}
            clearable
          />
          <Select
            label="Orden"
            placeholder="Ascendente"
            data={sortOrderOptions}
            value={selectedSortOrder ?? null}
            onChange={(v) => onSortOrderChange((v as SortOrder) || undefined)}
            clearable
          />
        </Group>
        <Group justify="flex-end">
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            leftSection={<IconX size={14} />}
            onClick={onClear}
            disabled={!hasActiveFilters}
          >
            Limpiar filtros
          </Button>
        </Group>
      </Stack>
    </Paper>
  );
}
