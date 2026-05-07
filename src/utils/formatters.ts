import dayjs from "dayjs";

export function formatMatchDay(matchDay: number): string {
  return `Jornada ${matchDay}`;
}

export function formatTeamName(name: string, countryName: string): string {
  return `${name} (${countryName})`;
}

export function formatCreatedAt(isoString: string): string {
  return dayjs(isoString).format("DD/MM/YYYY HH:mm");
}

export function formatApiError(error: unknown): string {
  if (error instanceof Error) return error.message;
  if (typeof error === "string") return error;
  return "Error desconocido";
}
