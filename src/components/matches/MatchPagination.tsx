"use client";

import { Group, Pagination, Text } from "@mantine/core";
import type { Pagination as PaginationType } from "../../types/api";

type Props = {
  pagination: PaginationType;
  onPageChange: (page: number) => void;
};

export function MatchPagination({ pagination, onPageChange }: Props) {
  if (pagination.totalPages <= 1) return null;

  return (
    <Group justify="space-between" align="center">
      <Text size="sm" c="dimmed">
        {pagination.total} partidos — página {pagination.page} de {pagination.totalPages}
      </Text>
      <Pagination
        value={pagination.page}
        total={pagination.totalPages}
        onChange={onPageChange}
        size="sm"
      />
    </Group>
  );
}
