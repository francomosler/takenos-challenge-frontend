// Tipos alineados con las respuestas reales del backend (ver docs/openapi.yaml)

export type Country = {
  id: number;
  name: string;
};

export type Team = {
  id: number;
  name: string;
  country: Country;
};

export type Match = {
  id: string;
  homeTeam: Team;
  awayTeam: Team;
  matchDay: number;
};

export type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export type SearchMatchesResponse = {
  matches: Match[];
  pagination: Pagination;
};

export type SearchTeamsResponse = {
  teams: Team[];
};

export type TeamDetailResponse = {
  team: Team;
  matches: Match[];
};

export type Pot = {
  id: number;
  teams: Team[];
};

export type DrawMatch = {
  id?: number;
  drawId: number;
  homeTeam: Team;
  awayTeam: Team;
  matchDay: number;
};

export type Draw = {
  id: number;
  createdAt: string;
  pots: Pot[];
  matches: DrawMatch[];
};

export type DrawStatistics = {
  drawId: number;
  createdAt: string;
  totalTeams: number;
  totalCountries: number;
  totalMatches: number;
  matchesPerMatchDay: { matchDay: number; count: number }[];
  teamsPerPot: { potId: number; count: number }[];
  teamsPerCountry: { countryId: number; countryName: string; count: number }[];
};

// Filtros para GET /matches
export type MatchSortBy = "matchDay" | "id" | "homeTeam" | "awayTeam";
export type SortOrder = "asc" | "desc";

export type MatchesFilters = {
  teamId?: number;
  countryId?: number;
  matchDay?: number;
  matchDayFrom?: number;
  matchDayTo?: number;
  sortBy?: MatchSortBy;
  sortOrder?: SortOrder;
  page?: number;
  limit?: number;
};

// Filtros para GET /teams
export type TeamsFilters = {
  countryId?: number;
  search?: string;
};

// Filtro client-side para local/visitante
export type MatchSide = "all" | "home" | "away";

// Jornadas posibles (1-8)
export const MATCH_DAYS = [1, 2, 3, 4, 5, 6, 7, 8] as const;
export type MatchDay = (typeof MATCH_DAYS)[number];
