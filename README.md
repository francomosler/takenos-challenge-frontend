# Champions League Draw — Frontend

Aplicación frontend que consume la API del sorteo de Champions League y permite visualizar y explorar partidos, equipos, jornadas y estadísticas.

## Stack tecnológico

- **Next.js 14** (App Router, client-side rendering)
- **React 18** + **TypeScript 5**
- **Mantine v7** (componentes UI, layout, theming)
- **Vitest** + **React Testing Library** (tests unitarios)
- **dayjs** (formateo de fechas)
- **@tabler/icons-react** (iconos)

## Quickstart

### Requisitos

- Node.js >= 18
- Backend corriendo en `http://localhost:8000` (ver carpeta `takenos-challenge`)

### Instalación

```bash
cd takenos-challenge-frontend
npm install
```

### Desarrollo

```bash
npm run dev
```

La app se levanta en `http://localhost:3000`.

### Autenticación

La aplicación requiere login para acceder. Credenciales por defecto:

- **Usuario:** `admin`
- **Contraseña:** `admin`

> **Nota:** Esta autenticación es una implementación simplificada para desarrollo. En un entorno productivo se reemplazaría por un sistema completo con almacenamiento seguro de usuarios, hashing de contraseñas, refresh tokens, y gestión de sesiones adecuada.

### Build de producción

```bash
npm run build
npm start
```

### Tests

```bash
npm test          # una vez
npm run test:watch  # modo watch
```

### Levantar el backend

```bash
cd ../takenos-challenge
npm install
npm run seed      # si la DB no tiene datos
npx tsx bin/www.ts
```

El backend corre en `http://localhost:8000` por defecto. La variable `FRONTEND_URL` permite configurar el origin de CORS (default: `http://localhost:3000`).

## Arquitectura

```
app/                  → App Router (thin wrappers "use client")
src/
  api/                → fetch wrapper + módulos por dominio
  types/              → tipos TS alineados a las respuestas del backend
  components/
    common/           → LoadingState, ErrorState, EmptyState, PageHeader
    layout/           → AppLayout (shell), Navbar, DrawBanner
    matches/          → MatchTable, MatchFilters, MatchPagination
    teams/            → TeamCard
  views/              → componentes de página completos
  hooks/              → data fetching + filtros URL
  context/            → DrawStatusContext (estado global mínimo)
  utils/              → lógica pura (filtros client-side, formatters)
  tests/              → unit tests (Vitest)
```

## Endpoints consumidos

| Endpoint | Método | Uso |
|----------|--------|-----|
| `/draw` | GET | Verificar si hay sorteo activo |
| `/draw` | POST | Crear sorteo |
| `/draw` | DELETE | Eliminar sorteo |
| `/draw/statistics` | GET | Dashboard de estadísticas |
| `/matches` | GET | Listado paginado con filtros |
| `/matches/:id` | GET | Detalle de un partido |
| `/teams` | GET | Listado con búsqueda y filtro por país |
| `/teams/:id` | GET | Detalle de equipo + sus partidos |

### Filtros de /matches

- `teamId` — filtrar partidos de un equipo
- `countryId` — filtrar por país
- `matchDay` — jornada exacta
- `matchDayFrom` / `matchDayTo` — rango de jornadas
- `sortBy` — matchDay | id | homeTeam | awayTeam
- `sortOrder` — asc | desc
- `page` / `limit` — paginación

### Filtro client-side

- **Local/Visitante**: se filtra en el frontend cuando se selecciona un equipo, usando los datos de `homeTeam`/`awayTeam` que ya vienen en la respuesta.

## Decisiones técnicas

1. **Todo client-side ("use client")**: la app es 100% interactiva y consume una API externa. No hay beneficio real de SSR para este caso.
2. **URL como fuente de verdad para filtros**: permite compartir links con filtros aplicados y que back/forward del browser funcione correctamente.
3. **src/views/ en vez de src/pages/**: Next.js trata la carpeta `pages/` como Pages Router, por eso los componentes de página van en `views/`.
4. **Suspense boundaries**: requerido por Next.js 14 para componentes que usan `useSearchParams()` durante el build estático.
5. **Vitest separado**: configurado en `vitest.config.ts` independiente de Next.js para no interferir con el build.
6. **AbortController en hooks**: cada fetch cancela el anterior para evitar race conditions con cambios rápidos de filtros.
7. **DrawStatusContext mínimo**: solo mantiene si hay sorteo y cuándo se creó. El resto de los datos se fetchea localmente en cada página.

## Limitaciones detectadas

- El backend no expone un endpoint de países independiente. La lista de países se deriva de los equipos.
- El campo `id` de match es string en la respuesta de `GET /matches` (decimal stringificado del int de la DB).
- No hay SSR real porque todos los datos dependen del estado del sorteo (que puede no existir).
- La eliminación del sorteo no tiene confirmación server-side (soft delete), por lo que la UI muestra un confirm nativo del browser.

## Mejoras sugeridas

- Agregar un endpoint `GET /countries` en el backend para no depender de derivar países desde equipos.
- Implementar SSR selectivo para páginas que no dependen de estado del sorteo (ej. listado de equipos si se desacoplan del draw).
- Agregar tests de integración con MSW (Mock Service Worker) para simular la API completa.
- Implementar infinite scroll o virtual scrolling para el listado de partidos si la cantidad crece.
- Agregar dark mode (Mantine lo soporta nativamente con `ColorSchemeScript`).

## Variables de entorno

| Variable | Default | Descripción |
|----------|---------|-------------|
| `NEXT_PUBLIC_API_BASE_URL` | `http://localhost:8000` | URL base de la API del backend |
