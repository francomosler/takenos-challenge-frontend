"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getTeamById } from "../api/teamsApi";
import { ApiError } from "../api/client";
import type { Match, Team } from "../types/api";

type UseTeamDetailResult = {
  data: { team: Team; matches: Match[] } | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  refresh: () => void;
};

export function useTeamDetail(id: number | null): UseTeamDetailResult {
  const [data, setData] = useState<UseTeamDetailResult["data"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(() => {
    if (id === null || isNaN(id)) {
      setLoading(false);
      setNotFound(true);
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setNotFound(false);

    getTeamById(id, controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) setData(res);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : "Error al cargar equipo");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, notFound, refresh: fetchData };
}
