import type { Match, MatchSide } from "../types/api";

/**
 * Filtra partidos por lado (local/visitante) respecto a un equipo.
 * Si side es "all", devuelve todos.
 */
export function filterBySide(matches: Match[], teamId: number, side: MatchSide): Match[] {
  if (side === "all") return matches;
  if (side === "home") return matches.filter((m) => m.homeTeam.id === teamId);
  return matches.filter((m) => m.awayTeam.id === teamId);
}

/**
 * Agrupa partidos por jornada, preservando el orden dentro de cada grupo.
 */
export function groupByMatchDay(matches: Match[]): Map<number, Match[]> {
  const grouped = new Map<number, Match[]>();
  for (const match of matches) {
    const existing = grouped.get(match.matchDay);
    if (existing) {
      existing.push(match);
    } else {
      grouped.set(match.matchDay, [match]);
    }
  }
  return grouped;
}
