"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getMatches } from "../api/matchesApi";
import type { Match, MatchesFilters, Pagination } from "../types/api";

type UseMatchesResult = {
  data: { matches: Match[]; pagination: Pagination } | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

export function useMatches(filters: MatchesFilters): UseMatchesResult {
  const [data, setData] = useState<UseMatchesResult["data"]>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);

    getMatches(filters, controller.signal)
      .then((res) => {
        if (!controller.signal.aborted) {
          setData(res);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err instanceof Error ? err.message : "Error al cargar partidos");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      });
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, refresh: fetchData };
}
