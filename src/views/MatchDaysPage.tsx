"use client";

import { Badge, Stack, Tabs } from "@mantine/core";
import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { MatchTable } from "../components/matches/MatchTable";
import { useMatches } from "../hooks/useMatches";
import { MATCH_DAYS } from "../types/api";

const EMPTY_PARAMS = new URLSearchParams();
const DEFAULT_TAB = "1";

export function MatchDaysPage() {
  const searchParams = useSearchParams() ?? EMPTY_PARAMS;
  const router = useRouter();
  const pathname = usePathname() ?? "/";

  const activeTab = searchParams.get("matchDay") ?? DEFAULT_TAB;
  const matchDay = Number(activeTab);

  const filters = useMemo(
    () => ({
      matchDay:
        Number.isInteger(matchDay) && matchDay >= 1 && matchDay <= 8 ? matchDay : 1,
      page: 1,
      limit: 50,
      sortBy: "id" as const,
      sortOrder: "asc" as const,
    }),
    [matchDay]
  );

  const { data, loading, error, refresh } = useMatches(filters);

  const handleTabChange = (value: string | null) => {
    if (!value) return;
    const next = new URLSearchParams(searchParams.toString());
    next.set("matchDay", value);
    router.replace(`${pathname}?${next.toString()}`);
  };

  return (
    <Stack gap="lg">
      <PageHeader
        title="Jornadas"
        subtitle="Vista de los 18 partidos de cada una de las 8 jornadas."
      />

      <Tabs value={activeTab} onChange={handleTabChange} keepMounted={false}>
        <Tabs.List>
          {MATCH_DAYS.map((day) => (
            <Tabs.Tab key={day} value={String(day)}>
              <Badge
                variant={String(day) === activeTab ? "filled" : "light"}
                color="indigo"
                size="sm"
              >
                J{day}
              </Badge>
            </Tabs.Tab>
          ))}
        </Tabs.List>

        <Tabs.Panel value={activeTab} pt="md">
          {loading && <LoadingState label={`Cargando jornada ${activeTab}...`} />}
          {!loading && error && <ErrorState message={error} onRetry={refresh} />}
          {!loading && !error && data && (
            <>
              {data.matches.length === 0 ? (
                <EmptyState
                  title="Jornada vacía"
                  description="No hay partidos cargados para esta jornada. ¿Hay un sorteo activo?"
                />
              ) : (
                <MatchTable matches={data.matches} />
              )}
            </>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
