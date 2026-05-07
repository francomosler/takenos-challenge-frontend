"use client";

import { Anchor, Badge, Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconArrowLeft, IconShirtSport } from "@tabler/icons-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { useMatchDetail } from "../hooks/useMatchDetail";

export function MatchDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ? Number(params.id) : null;
  const { data, loading, error, notFound, refresh } = useMatchDetail(id);

  return (
    <Stack gap="lg">
      <PageHeader
        title="Detalle del partido"
        actions={
          <Button
            component={Link}
            href="/matches"
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
          title="Partido no encontrado"
          description={`No encontramos un partido con id ${params?.id ?? "desconocido"}.`}
        />
      )}

      {!loading && !error && data && (
        <Card withBorder padding="lg" radius="md">
          <Stack gap="md">
            <Group justify="space-between" align="flex-start" wrap="wrap">
              <Stack gap={4}>
                <Text size="xs" c="dimmed">
                  ID partido
                </Text>
                <Title order={3}>#{data.id}</Title>
              </Stack>
              <Badge color="indigo" variant="light" size="lg">
                Jornada {data.matchDay}
              </Badge>
            </Group>

            <Group grow align="stretch">
              <TeamPanel
                role="Local"
                color="blue"
                name={data.homeTeam.name}
                country={data.homeTeam.country.name}
                teamId={data.homeTeam.id}
              />
              <TeamPanel
                role="Visitante"
                color="grape"
                name={data.awayTeam.name}
                country={data.awayTeam.country.name}
                teamId={data.awayTeam.id}
              />
            </Group>
          </Stack>
        </Card>
      )}
    </Stack>
  );
}

type TeamPanelProps = {
  role: string;
  color: "blue" | "grape";
  name: string;
  country: string;
  teamId: number;
};

function TeamPanel({ role, color, name, country, teamId }: TeamPanelProps) {
  return (
    <Card withBorder padding="md" radius="md">
      <Stack gap="sm">
        <Group justify="space-between">
          <Badge color={color} variant="light">
            {role}
          </Badge>
          <IconShirtSport size={20} />
        </Group>
        <Stack gap={2}>
          <Title order={4}>{name}</Title>
          <Text size="sm" c="dimmed">
            {country}
          </Text>
        </Stack>
        <Anchor component={Link} href={`/teams/${teamId}`} size="sm">
          Ver equipo y sus partidos
        </Anchor>
      </Stack>
    </Card>
  );
}
