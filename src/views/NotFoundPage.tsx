"use client";

import { Button, Center, Stack, Text, Title } from "@mantine/core";
import Link from "next/link";

export function NotFoundPage() {
  return (
    <Center mih={400}>
      <Stack align="center" gap="md">
        <Title order={1}>404</Title>
        <Text c="dimmed">La página que buscás no existe.</Text>
        <Button component={Link} href="/matches" variant="light">
          Volver a partidos
        </Button>
      </Stack>
    </Center>
  );
}
