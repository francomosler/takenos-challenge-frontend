"use client";

import { Button, Center, Stack, Text, Title } from "@mantine/core";

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function EmptyState({ title, description, actionLabel, onAction }: Props) {
  return (
    <Center mih={200}>
      <Stack align="center" gap="sm">
        <Title order={4} c="dimmed">
          {title}
        </Title>
        {description && (
          <Text size="sm" c="dimmed" ta="center" maw={400}>
            {description}
          </Text>
        )}
        {actionLabel && onAction && (
          <Button variant="light" size="sm" onClick={onAction}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Center>
  );
}
