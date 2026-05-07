"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTeams } from "../api/teamsApi";
import type { Team, TeamsFilters } from "../types/api";

type UseTeamsResult = {
  data: Team[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useTeams(filters: TeamsFilters = {}): UseTeamsResult {
  const [data, setData] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    getTeams(filters, controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) setData(res.teams);
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Error al cargar equipos");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}
