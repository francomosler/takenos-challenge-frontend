import { http, HttpResponse } from "msw";
import type {
  Draw,
  DrawStatistics,
  Match,
  SearchMatchesResponse,
  SearchTeamsResponse,
  Team,
  TeamDetailResponse,
} from "../../types/api";

const mockTeam = (id: number, name: string, country: string): Team => ({
  id,
  name,
  country: { id, name: country },
});

export const teams: Team[] = [
  mockTeam(1, "Real Madrid", "Spain"),
  mockTeam(2, "Manchester City", "England"),
  mockTeam(3, "Bayern Munich", "Germany"),
  mockTeam(4, "PSG", "France"),
];

export const matches: Match[] = [
  { id: "1", homeTeam: teams[0], awayTeam: teams[1], matchDay: 1 },
  { id: "2", homeTeam: teams[2], awayTeam: teams[3], matchDay: 1 },
  { id: "3", homeTeam: teams[1], awayTeam: teams[0], matchDay: 2 },
  { id: "4", homeTeam: teams[3], awayTeam: teams[2], matchDay: 2 },
];

const baseUrl = "http://localhost:8000";

export const handlers = [
  http.get(`${baseUrl}/matches`, ({ request }) => {
    const url = new URL(request.url);
    const page = Number(url.searchParams.get("page") ?? "1");
    const limit = Number(url.searchParams.get("limit") ?? "12");
    const teamId = url.searchParams.get("teamId");

    let filtered = [...matches];
    if (teamId) {
      const tid = Number(teamId);
      filtered = filtered.filter(
        (m) => m.homeTeam.id === tid || m.awayTeam.id === tid
      );
    }

    const total = filtered.length;
    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    return HttpResponse.json<SearchMatchesResponse>({
      matches: paged,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  }),

  http.get(`${baseUrl}/matches/:id`, ({ params }) => {
    const match = matches.find((m) => m.id === params.id);
    if (!match) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    return HttpResponse.json(match);
  }),

  http.get(`${baseUrl}/teams`, () => {
    return HttpResponse.json<SearchTeamsResponse>({ teams });
  }),

  http.get(`${baseUrl}/teams/:id`, ({ params }) => {
    const team = teams.find((t) => t.id === Number(params.id));
    if (!team) return HttpResponse.json({ message: "Not found" }, { status: 404 });
    const teamMatches = matches.filter(
      (m) => m.homeTeam.id === team.id || m.awayTeam.id === team.id
    );
    return HttpResponse.json<TeamDetailResponse>({ team, matches: teamMatches });
  }),

  http.get(`${baseUrl}/draw`, () => {
    return HttpResponse.json<Draw>({
      id: 1,
      createdAt: "2026-01-15T10:00:00.000Z",
      pots: [],
      matches: matches.map((m) => ({ ...m, id: Number(m.id), drawId: 1 })),
    });
  }),

  http.get(`${baseUrl}/draw/statistics`, () => {
    return HttpResponse.json<DrawStatistics>({
      drawId: 1,
      createdAt: "2026-01-15T10:00:00.000Z",
      totalTeams: 4,
      totalCountries: 4,
      totalMatches: 4,
      matchesPerMatchDay: [
        { matchDay: 1, count: 2 },
        { matchDay: 2, count: 2 },
      ],
      teamsPerPot: [{ potId: 1, count: 4 }],
      teamsPerCountry: [
        { countryId: 1, countryName: "Spain", count: 1 },
        { countryId: 2, countryName: "England", count: 1 },
        { countryId: 3, countryName: "Germany", count: 1 },
        { countryId: 4, countryName: "France", count: 1 },
      ],
    });
  }),

  http.get(`${baseUrl}/auth/me`, () => {
    return HttpResponse.json({ username: "admin" });
  }),

  http.post(`${baseUrl}/auth/login`, () => {
    return HttpResponse.json({ message: "Login successful" });
  }),

  http.post(`${baseUrl}/auth/logout`, () => {
    return HttpResponse.json({ message: "Logged out" });
  }),
];
