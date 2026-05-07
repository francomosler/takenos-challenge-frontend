"use client";

import { Alert, Anchor, Badge, Button, Group, Loader, Text } from "@mantine/core";
import { IconAlertCircle, IconCheck, IconPlus } from "@tabler/icons-react";
import { useState } from "react";
import Link from "next/link";

import { ApiError } from "../../api/client";
import { createDraw } from "../../api/drawApi";
import { useDrawStatus } from "../../context/DrawStatusContext";
import { formatCreatedAt } from "../../utils/formatters";

export function DrawBanner() {
  const { hasDraw, createdAt, loading, error, refresh } = useDrawStatus();
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  if (loading && hasDraw === null) {
    return (
      <Group gap="xs" px="md" py={6}>
        <Loader size="xs" />
        <Text size="sm" c="dimmed">
          Verificando estado del sorteo...
        </Text>
      </Group>
    );
  }

  if (error) {
    return (
      <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light">
        No se pudo verificar el sorteo: {error}.{" "}
        <Anchor component="button" type="button" onClick={() => void refresh()}>
          Reintentar
        </Anchor>
      </Alert>
    );
  }

  if (hasDraw === false) {
    const handleCreate = async () => {
      setCreating(true);
      setCreateError(null);
      try {
        await createDraw();
        await refresh();
      } catch (err) {
        if (err instanceof ApiError && err.status === 409) {
          await refresh();
          return;
        }
        setCreateError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setCreating(false);
      }
    };

    return (
      <Alert
        icon={<IconAlertCircle size={16} />}
        color="yellow"
        variant="light"
        title="No hay sorteo activo"
      >
        <Group justify="space-between" wrap="wrap" gap="sm">
          <Text size="sm">
            Generá el sorteo para empezar a ver partidos, equipos y estadísticas.
          </Text>
          <Group gap="sm">
            {createError && (
              <Text size="sm" c="red">
                {createError}
              </Text>
            )}
            <Button
              size="xs"
              leftSection={<IconPlus size={14} />}
              loading={creating}
              onClick={() => void handleCreate()}
            >
              Crear sorteo
            </Button>
          </Group>
        </Group>
      </Alert>
    );
  }

  return (
    <Group justify="space-between" wrap="wrap" gap="sm">
      <Group gap="xs">
        <Badge color="green" leftSection={<IconCheck size={12} />} variant="light">
          Sorteo activo
        </Badge>
        {createdAt && (
          <Text size="sm" c="dimmed">
            Creado el {formatCreatedAt(createdAt)}
          </Text>
        )}
      </Group>
      <Anchor component={Link} href="/dashboard" size="sm">
        Ver detalle
      </Anchor>
    </Group>
  );
}
