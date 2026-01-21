# DSpace Angular AI Coding Agent Instructions

## Project Overview
DSpace Angular (v9.2.0) is a server-side rendered (SSR) Angular 20+ application providing the UI for DSpace repositories. It communicates with a Java-based REST API backend via HAL+JSON. The application uses NgRx for state management, Angular Universal for SSR, and RxJS for reactive patterns.

## Architecture Essentials

### Layered Structure
- **src/app/core/**: State, caching, REST communication, authentication (don't add UI components here)
- **src/app/shared/**: Reusable components, utilities, forms, common patterns
- **src/app/[feature]/**: Feature-specific pages/components (submission, search, browse, admin, etc.)
- **Server rendering**: server.ts (Express) handles SSR; main.server.ts exports the app

### Data Flow: REST → Cache → Store → Components
1. `RequestService` handles HTTP requests with automatic retry/error handling
2. `RemoteData<T>` wraps responses with loading/error states (subscription-based, not promises)
3. `BaseDataService` and specialized data services (e.g., `ItemDataService`) query REST and cache via `ObjectCacheService`
4. NgRx state holds UI state (forms, filters, sidebar) not entity data—entities stay in cache
5. Components subscribe to observables from store/cache and render lazily

## Critical Patterns

### HAL/Resource Models
Every entity extends `HALResource` with `@typedObject` decorator:
```typescript
@typedObject
export class Item extends HALResource {
  @autoserialize uuid: string;
  @link(BUNDLE) bundles?: Observable<RemoteData<PaginatedList<Bundle>>>;
  _links: { self: HALLink; /* ... */ };
}
```
- Resource types defined in separate files (e.g., `item.resource-type.ts`) to prevent circular dependencies
- Use `@link()` decorator for HAL links; they resolve on demand via `FollowLinkConfig`
- Lazy-loaded via `LAZY_DATA_SERVICES` map in [data-services-map.ts](src/app/core/data-services-map.ts)

### Data Services (Feature Pattern)
```typescript
export class ItemDataService extends IdentifiableDataService<Item> 
  implements CreateData<Item>, SearchData<Item> {
  private createData: CreateData<Item>;
  
  create(...) { return this.createData.create(...); }
  search(...) { return this.searchData.search(...); }
}
```
- Extend base class + implement feature interfaces; delegate to helper classes
- All return `Observable<RemoteData<T>>`, never plain promises
- Example files: [item-data.service.ts](src/app/core/data/item-data.service.ts), [collection-data.service.ts](src/app/core/data/collection-data.service.ts)

### Themed Components (Design System)
Most components have a base + themed variant for white-labeling:
```typescript
// Base: src/app/search-page/search-page.component.ts
export class SearchPageComponent { /* logic */ }

// Themed: src/app/search-page/themed-search-page.component.ts
export class ThemedSearchPageComponent extends ThemedComponent<SearchPageComponent> {}
```
- Override in custom themes under `src/themes/[theme-name]/`
- Use `ThemedComponent<T>` base class for polymorphic rendering

### State Management
- App state in [app.reducer.ts](src/app/app.reducer.ts); core state in [core.reducers.ts](src/app/core/core.reducers.ts)
- Effects handle side effects; entity data queries avoid store (use cache directly)
- Store holds: router state, forms, UI flags (sidebar, filters), notifications
- Use NgRx selectors for derived state; avoid redundant entity copies

### Forms & Submission
- Dynamic form builder in [src/app/shared/form/](src/app/shared/form/) uses `ng-dynamic-forms`
- Submission state managed by `SubmissionService` + effects
- Workitems/Workspace items edited via form builder; patch/put via data services

## Build & Development Workflows

### Key npm Scripts
- `npm start` → build:prod + serve:ssr (production)
- `npm run start:dev` → serve with watch mode (development)
- `npm run build:prod` → SSR build (dist/browser + dist/server)
- `npm test` → Jasmine/Karma unit tests; `npm run test:watch` for watch mode
- `npm run test:headless` → CI testing
- `npm run lint` → ESLint; `npm run lint-fix` for auto-fix
- `npm run e2e` → Cypress E2E tests
- `npm run clean` → Remove dist, coverage, node_modules

### Configuration (Runtime vs Build-time)
- **Runtime** (loaded at boot): `config/config.*.yml` + environment variables
  - Override via `DSPACE_*` env vars (e.g., `DSPACE_REST_HOST=api.example.org`)
  - Use `APP_CONFIG` injection token in components
- **Build-time**: `src/environments/environment.ts` for TypeScript constants

### Angular Universal SSR
- Express server in [server.ts](server.ts) renders initial HTML
- Handles cache busting, compression, security headers
- `BrowserModule` + `ServerModule` in [main.browser.ts](src/main.browser.ts) and [main.server.ts](src/main.server.ts)

## Testing Conventions

### Unit Tests
- Collocate tests with source: `*.component.spec.ts` in same folder
- Use Jasmine + Karma; run via `npm test`
- Mock `RemoteData`: `createSuccessfulRemoteDataObject(mockItem)` from testing utilities
- Test component initialization, event handlers, observable subscriptions

### E2E Tests (Cypress)
- Located in [cypress/e2e/](cypress/e2e/); run via `npm run e2e`
- Test admin, collections, search, submission workflows
- Config: [cypress.config.ts](cypress.config.ts) with demo environment variables
- Fixtures in [cypress/fixtures/](cypress/fixtures/); plugins in [cypress/plugins/](cypress/plugins/)

## Important Dependencies & Integration Points

- **Angular**: v20.3.12; Universal for SSR
- **NgRx**: state management (@ngrx/store, @ngrx/effects)
- **RxJS**: observables; use operators like `switchMap`, `map`, `shareReplay`
- **Cerialize**: JSON serialization (decorators: `@autoserialize`, `@deserialize`, `@link`)
- **REST API**: HAL+JSON responses; documented in [DSpace RestContract](https://github.com/DSpace/RestContract)
- **ng-dynamic-forms**: Dynamic form generation for submissions
- **i18n**: Translation via `ngx-translate`; files in [src/assets/i18n/](src/assets/i18n/)

## Common Gotchas

1. **Always use RemoteData**, not plain responses: `RemoteData<T>` includes loading/error states
2. **Avoid store for entities**: Query cache via data services; store only holds UI state
3. **Link resolution**: Use `FollowLinkConfig` to lazily resolve HAL links; omitting them breaks templates
4. **Circular dependencies**: Put resource types in separate `.resource-type.ts` files
5. **Component prefix**: Use `ds-` selector prefix (configured in [angular.json](angular.json))
6. **SSR mode detection**: Use `isPlatformBrowser()/isPlatformServer()` for conditional logic
7. **Caching strategy**: `ObjectCacheService` caches by UUID; respects TTL from `cache.msToLive.*` config

## Key File References
- Feature examples: [item-page/](src/app/item-page/), [search-page/](src/app/search-page/), [submission/](src/app/submission/)
- Utilities: [src/app/shared/utils/](src/app/shared/utils/), [src/app/core/utilities/](src/app/core/utilities/)
- Core modules: [provide-core.ts](src/app/core/provide-core.ts) for dependency injection setup
