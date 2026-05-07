"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { getDraw } from "../api/drawApi";
import { ApiError } from "../api/client";

type DrawStatus = {
  hasDraw: boolean | null;
  createdAt: string | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
};

const DrawStatusContext = createContext<DrawStatus | null>(null);

export function DrawStatusProvider({ children }: { children: ReactNode }) {
  const [hasDraw, setHasDraw] = useState<boolean | null>(null);
  const [createdAt, setCreatedAt] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const draw = await getDraw();
      setHasDraw(true);
      setCreatedAt(draw.createdAt);
    } catch (err) {
      if (err instanceof ApiError && err.status === 404) {
        setHasDraw(false);
        setCreatedAt(null);
      } else {
        setError(err instanceof Error ? err.message : "Error desconocido");
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return (
    <DrawStatusContext.Provider value={{ hasDraw, createdAt, loading, error, refresh }}>
      {children}
    </DrawStatusContext.Provider>
  );
}

export function useDrawStatus(): DrawStatus {
  const ctx = useContext(DrawStatusContext);
  if (!ctx) {
    throw new Error("useDrawStatus must be used within DrawStatusProvider");
  }
  return ctx;
}
