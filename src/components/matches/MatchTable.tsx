"use client";

import { ActionIcon, Badge, Group, Table, Text } from "@mantine/core";
import { IconEye } from "@tabler/icons-react";
import Link from "next/link";

import type { Match } from "../../types/api";

type Props = {
  matches: Match[];
  highlightTeamId?: number;
};

export function MatchTable({ matches, highlightTeamId }: Props) {
  return (
    <Table.ScrollContainer minWidth={600}>
      <Table striped highlightOnHover withTableBorder>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Jornada</Table.Th>
            <Table.Th>Local</Table.Th>
            <Table.Th>Visitante</Table.Th>
            <Table.Th style={{ width: 60 }}></Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {matches.map((match) => {
            const isHomeHighlighted =
              highlightTeamId !== undefined && match.homeTeam.id === highlightTeamId;
            const isAwayHighlighted =
              highlightTeamId !== undefined && match.awayTeam.id === highlightTeamId;

            return (
              <Table.Tr key={match.id}>
                <Table.Td>
                  <Badge variant="light" color="indigo">
                    J{match.matchDay}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <TeamCell
                    name={match.homeTeam.name}
                    countryName={match.homeTeam.country.name}
                    sideLabel="Local"
                    sideColor="blue"
                    highlighted={isHomeHighlighted}
                  />
                </Table.Td>
                <Table.Td>
                  <TeamCell
                    name={match.awayTeam.name}
                    countryName={match.awayTeam.country.name}
                    sideLabel="Visitante"
                    sideColor="grape"
                    highlighted={isAwayHighlighted}
                  />
                </Table.Td>
                <Table.Td>
                  <ActionIcon
                    component={Link}
                    href={`/matches/${match.id}`}
                    variant="subtle"
                    aria-label={`Ver detalle del partido ${match.id}`}
                  >
                    <IconEye size={16} />
                  </ActionIcon>
                </Table.Td>
              </Table.Tr>
            );
          })}
        </Table.Tbody>
      </Table>
    </Table.ScrollContainer>
  );
}

type TeamCellProps = {
  name: string;
  countryName: string;
  sideLabel: string;
  sideColor: "blue" | "grape";
  highlighted: boolean;
};

function TeamCell({
  name,
  countryName,
  sideLabel,
  sideColor,
  highlighted,
}: TeamCellProps) {
  return (
    <Group gap="xs" wrap="nowrap">
      <Badge size="xs" color={sideColor} variant="outline">
        {sideLabel}
      </Badge>
      <div>
        <Text fw={highlighted ? 600 : 500}>{name}</Text>
        <Text size="xs" c="dimmed">
          {countryName}
        </Text>
      </div>
    </Group>
  );
}
