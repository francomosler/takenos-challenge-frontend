"use client";

import {
  Badge,
  Button,
  Card,
  Group,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { IconRefresh, IconTrash } from "@tabler/icons-react";
import { useState } from "react";

import { EmptyState } from "../components/common/EmptyState";
import { ErrorState } from "../components/common/ErrorState";
import { LoadingState } from "../components/common/LoadingState";
import { PageHeader } from "../components/common/PageHeader";
import { deleteDraw } from "../api/drawApi";
import { useDrawStatus } from "../context/DrawStatusContext";
import { useDrawStatistics } from "../hooks/useDrawStatistics";
import { formatCreatedAt } from "../utils/formatters";

export function DrawDashboardPage() {
  const { hasDraw, refresh: refreshStatus } = useDrawStatus();
  const { data, loading, error, notFound, refresh } = useDrawStatistics();
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = async () => {
    if (!confirm("¿Eliminar el sorteo actual? Esta acción no se puede deshacer.")) {
      return;
    }
    setDeleting(true);
    setDeleteError(null);
    try {
      await deleteDraw();
      await refreshStatus();
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : "Error al eliminar");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <Stack gap="lg">
      <PageHeader
        title="Dashboard"
        subtitle="Estadísticas del sorteo actual y acciones administrativas."
        actions={
          <Group gap="xs">
            <Button
              size="xs"
              variant="light"
              leftSection={<IconRefresh size={14} />}
              onClick={() => {
                refresh();
                void refreshStatus();
              }}
            >
              Actualizar
            </Button>
            {hasDraw && (
              <Button
                size="xs"
                variant="light"
                color="red"
                leftSection={<IconTrash size={14} />}
                loading={deleting}
                onClick={() => void handleDelete()}
              >
                Eliminar sorteo
              </Button>
            )}
          </Group>
        }
      />

      {deleteError && <ErrorState message={deleteError} />}

      {loading && <LoadingState label="Cargando estadísticas..." />}

      {!loading && error && <ErrorState message={error} onRetry={refresh} />}

      {!loading && notFound && (
        <EmptyState
          title="Sin sorteo"
          description="No hay sorteo activo. Creá uno desde el banner superior."
        />
      )}

      {!loading && !error && data && (
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 2, md: 4 }} spacing="md">
            <StatCard label="Partidos" value={data.totalMatches} />
            <StatCard label="Equipos" value={data.totalTeams} />
            <StatCard label="Países" value={data.totalCountries} />
            <StatCard label="Creado" value={formatCreatedAt(data.createdAt)} />
          </SimpleGrid>

          <Card withBorder padding="md" radius="md">
            <Stack gap="sm">
              <Title order={5}>Partidos por jornada</Title>
              <Group gap="xs" wrap="wrap">
                {data.matchesPerMatchDay.map((item) => (
                  <Badge key={item.matchDay} variant="light" color="indigo" size="lg">
                    J{item.matchDay}: {item.count}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Stack gap="sm">
              <Title order={5}>Equipos por pot</Title>
              <Group gap="xs" wrap="wrap">
                {data.teamsPerPot.map((item) => (
                  <Badge key={item.potId} variant="light" color="teal" size="lg">
                    Pot {item.potId}: {item.count}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>

          <Card withBorder padding="md" radius="md">
            <Stack gap="sm">
              <Title order={5}>Equipos por país</Title>
              <Group gap="xs" wrap="wrap">
                {data.teamsPerCountry.map((item) => (
                  <Badge key={item.countryId} variant="light" color="orange" size="lg">
                    {item.countryName}: {item.count}
                  </Badge>
                ))}
              </Group>
            </Stack>
          </Card>
        </Stack>
      )}
    </Stack>
  );
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card withBorder padding="md" radius="md">
      <Stack gap={2}>
        <Text size="xs" c="dimmed" tt="uppercase" fw={600}>
          {label}
        </Text>
        <Title order={3}>{value}</Title>
      </Stack>
    </Card>
  );
}
