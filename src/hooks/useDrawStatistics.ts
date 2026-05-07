"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { getDrawStatistics } from "../api/drawApi";
import { ApiError } from "../api/client";
import type { DrawStatistics } from "../types/api";

type UseDrawStatisticsResult = {
  data: DrawStatistics | null;
  loading: boolean;
  error: string | null;
  notFound: boolean;
  refresh: () => void;
};

export function useDrawStatistics(): UseDrawStatisticsResult {
  const [data, setData] = useState<DrawStatistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(() => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setLoading(true);
    setError(null);
    setNotFound(false);

    getDrawStatistics(controller.signal)
      .then((stats) => {
        if (!controller.signal.aborted) setData(stats);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        if (err instanceof ApiError && err.status === 404) {
          setNotFound(true);
        } else {
          setError(err instanceof Error ? err.message : "Error al cargar estadísticas");
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchData();
    return () => abortRef.current?.abort();
  }, [fetchData]);

  return { data, loading, error, notFound, refresh: fetchData };
}
