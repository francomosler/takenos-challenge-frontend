"use client";

import { Alert, Button, Group } from "@mantine/core";
import { IconAlertCircle } from "@tabler/icons-react";

type Props = {
  message: string;
  onRetry?: () => void;
};

export function ErrorState({ message, onRetry }: Props) {
  return (
    <Alert icon={<IconAlertCircle size={16} />} color="red" variant="light" title="Error">
      <Group justify="space-between" align="center" wrap="wrap">
        {message}
        {onRetry && (
          <Button size="xs" variant="light" color="red" onClick={onRetry}>
            Reintentar
          </Button>
        )}
      </Group>
    </Alert>
  );
}
