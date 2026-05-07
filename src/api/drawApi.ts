import { apiFetch } from "./client";
import type { Draw, DrawStatistics } from "../types/api";

export async function getDraw(signal?: AbortSignal): Promise<Draw> {
  return apiFetch<Draw>("/draw", { signal });
}

export async function getDrawStatistics(signal?: AbortSignal): Promise<DrawStatistics> {
  return apiFetch<DrawStatistics>("/draw/statistics", { signal });
}

export async function createDraw(): Promise<void> {
  await apiFetch<unknown>("/draw", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    expectJson: false,
  });
}

export async function deleteDraw(): Promise<void> {
  await apiFetch<unknown>("/draw", {
    method: "DELETE",
    expectJson: false,
  });
}
