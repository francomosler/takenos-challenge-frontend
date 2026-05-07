"use client";

import {
  Badge,
  Button,
  Card,
  Group,
  SegmentedControl,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { MatchTable } from "../components/matches/MatchTable";
import { useTeamDetail } from "../hooks/useTeamDetail";
import { filterBySide, groupByMatchDay } from "../utils/filters";
import type { MatchSide } from "../types/api";

export function TeamDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? Number(params.id) : null;
  const { data, loading, error, notFound, refresh } = useTeamDetail(id);

  const [side, setSide] = useState<MatchSide>("all");

  const filteredMatches = useMemo(() => {
    if (!data) return [];
    return filterBySide(data.matches, data.team.id, side);
  }, [data, side]);

  const grouped = useMemo(() => groupByMatchDay(filteredMatches), [filteredMatches]);

  return (
    <Stack gap="lg">
      <PageHeader
        title="Detalle del equipo"
        actions={
          <Button
            component={Link}
            href="/teams"
            variant="subtle"
            leftSection={<IconArrowLeft size={14} />}
            size="xs"
          >
            Volver
          </Button>
        }
      />

      {loading && <LoadingState />}

      {!loading && error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && notFound && (
        <EmptyState
          title="Equipo no encontrado"
          description={`No encontramos un equipo con id ${params?.id ?? "desconocido"}.`}
        />
      )}

      {!loading && !error && data && (
        <Stack gap="md">
          <Card withBorder padding="lg" radius="md">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Stack gap={2}>
                <Text size="xs" c="dimmed">
                  Equipo
                </Text>
                <Title order={2}>{data.team.name}</Title>
                <Group gap={6} mt={4}>
                  <Badge variant="light" color="gray">
                    {data.team.country.name}
                  </Badge>
                  <Badge variant="light" color="indigo">
                    {data.matches.length} partidos
                  </Badge>
                </Group>
              </Stack>
              <SegmentedControl
                value={side}
                onChange={(v) => setSide(v as MatchSide)}
                data={[
                  { value: "all", label: "Todos" },
                  { value: "home", label: "Local" },
                  { value: "away", label: "Visitante" },
                ]}
              />
            </Group>
          </Card>

          {filteredMatches.length === 0 ? (
            <EmptyState
              title="Sin partidos"
              description={
                side === "all"
                  ? "Este equipo no tiene partidos en el sorteo actual."
                  : `No tiene partidos como ${side === "home" ? "local" : "visitante"}.`
              }
            />
          ) : (
            <Stack gap="md">
              {Array.from(grouped.entries()).map(([matchDay, matches]) => (
                <Stack key={matchDay} gap="xs">
                  <Group gap="xs">
                    <Title order={5}>Jornada {matchDay}</Title>
                    <Badge size="xs" variant="light" color="gray">
                      {matches.length} partido{matches.length === 1 ? "" : "s"}
                    </Badge>
                  </Group>
                  <MatchTable matches={matches} highlightTeamId={data.team.id} />
                </Stack>
              ))}
            </Stack>
          )}
        </Stack>
      )}
    </Stack>
  );
}
