"use client";

import { Badge, Card, Group, Stack, Text, Title } from "@mantine/core";
import { IconChevronRight } from "@tabler/icons-react";
import Link from "next/link";

import type { Team } from "../../types/api";

type Props = {
  team: Team;
};

export function TeamCard({ team }: Props) {
  return (
    <Card
      component={Link}
      href={`/teams/${team.id}`}
      withBorder
      padding="md"
      radius="md"
      style={{ textDecoration: "none", color: "inherit" }}
    >
      <Group justify="space-between" wrap="nowrap">
        <Stack gap={2}>
          <Title order={5}>{team.name}</Title>
          <Badge size="xs" variant="light" color="gray">
            {team.country.name}
          </Badge>
        </Stack>
        <IconChevronRight size={18} />
      </Group>
    </Card>
  );
}
