"use client";

import { Center, Loader, Stack, Text } from "@mantine/core";

type Props = {
  label?: string;
};

export function LoadingState({ label = "Cargando..." }: Props) {
  return (
    <Center mih={200}>
      <Stack align="center" gap="xs">
        <Loader size="md" />
        <Text size="sm" c="dimmed">
          {label}
        </Text>
      </Stack>
    </Center>
  );
}
