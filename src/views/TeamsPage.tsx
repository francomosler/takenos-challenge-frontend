"use client";

import {
  Button,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  TextInput,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { IconSearch, IconX } from "@tabler/icons-react";
import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { TeamCard } from "../components/teams/TeamCard";
import { useTeams } from "../hooks/useTeams";

const EMPTY_PARAMS = new URLSearchParams();

export function TeamsPage() {
  const searchParams = useSearchParams() ?? EMPTY_PARAMS;
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const initialSearch = searchParams.get("search") ?? "";
  const initialCountryId = searchParams.get("countryId") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [countryId, setCountryId] = useState<string | null>(initialCountryId || null);

  const [debouncedSearch] = useDebouncedValue(search, 250);

  const filters = useMemo(() => {
    return {
      countryId: countryId ? Number(countryId) : undefined,
      search: debouncedSearch.trim() || undefined,
    };
  }, [debouncedSearch, countryId]);

  useEffect(() => {
    const next = new URLSearchParams(searchParams.toString());
    if (filters.search) next.set("search", filters.search);
    else next.delete("search");
    if (filters.countryId !== undefined) next.set("countryId", String(filters.countryId));
    else next.delete("countryId");
    router.replace(`${pathname}?${next.toString()}`);
  }, [filters.search, filters.countryId, router, pathname, searchParams]);

  const allTeamsQuery = useTeams();
  const countryOptions = useMemo(() => {
    const seen = new Map<number, string>();
    for (const team of allTeamsQuery.data) {
      if (!seen.has(team.country.id)) {
        seen.set(team.country.id, team.country.name);
      }
    }
    return Array.from(seen.entries())
      .sort((a, b) => a[1].localeCompare(b[1]))
      .map(([id, name]) => ({ value: String(id), label: name }));
  }, [allTeamsQuery.data]);

  const filteredTeamsQuery = useTeams(filters);

  const hasActiveFilters = !!filters.search || filters.countryId !== undefined;

  const clearFilters = () => {
    setSearch("");
    setCountryId(null);
  };

  return (
    <Stack gap="lg">
      <PageHeader
        title="Equipos"
        subtitle="Los 36 equipos del sorteo. Click en uno para ver sus partidos."
      />

      <Paper withBorder p="md" radius="md">
        <Group grow align="flex-end" wrap="wrap">
          <TextInput
            label="Buscar por nombre"
            placeholder="Real Madrid, Bayern, ..."
            value={search}
            onChange={(e) => setSearch(e.currentTarget.value)}
            leftSection={<IconSearch size={14} />}
          />
          <Select
            label="País"
            placeholder="Todos los países"
            data={countryOptions}
            value={countryId}
            onChange={setCountryId}
            searchable
            clearable
            disabled={allTeamsQuery.loading}
          />
          <Group justify="flex-end" align="flex-end" h="100%">
            <Button
              variant="subtle"
              color="gray"
              leftSection={<IconX size={14} />}
              onClick={clearFilters}
              disabled={!hasActiveFilters}
            >
              Limpiar
            </Button>
          </Group>
        </Group>
      </Paper>

      {filteredTeamsQuery.loading && <LoadingState label="Cargando equipos..." />}

      {!filteredTeamsQuery.loading && filteredTeamsQuery.error && (
        <ErrorState
          message={filteredTeamsQuery.error}
          onRetry={filteredTeamsQuery.refresh}
        />
      )}

      {!filteredTeamsQuery.loading && !filteredTeamsQuery.error && (
        <>
          {filteredTeamsQuery.data.length === 0 ? (
            <EmptyState
              title="Sin equipos"
              description={
                hasActiveFilters
                  ? "Probá ajustar los filtros."
                  : "No hay equipos cargados."
              }
              actionLabel={hasActiveFilters ? "Limpiar filtros" : undefined}
              onAction={hasActiveFilters ? clearFilters : undefined}
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
              {filteredTeamsQuery.data.map((team) => (
                <TeamCard key={team.id} team={team} />
              ))}
            </SimpleGrid>
          )}
        </>
      )}
    </Stack>
  );
}
