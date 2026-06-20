# Agents

Guidance for AI agents working in this repository.

## Build & Verify

Always run these before committing:

```sh
mise run ci          # check code
mise run build       # bundle to dist/
```

## Architecture

Single-file extension (`src/index.ts`). No framework, no bundler plugins beyond `bun build`.

- **`toggleAll(disabled)`** — mutates the group's `disabled_members` array, persists via `POST /api/groups/edit`, and toggles `.disabled` class on DOM elements.
- **`init()`** — injects the button template into `#currentGroupMembers` above `#rm_group_members_header`. Uses event delegation on `document` for click handling.

## Key Constraints

- **`editGroup` is not exposed via `getContext()`** — the extension calls the REST API directly. This is the intended contract; do not attempt to import internal ST modules.
- **`printGroupMembers()` is internal** — UI refresh is done by toggling `.disabled` on `.group_member` elements in the DOM, matching ST's own behavior. Do not try to call `printGroupMembers()`.
- **No `getCharacters()` reload** — disabling/enabling doesn't change the member list, only the `disabled_members` array. A full reload causes unnecessary UI flicker.
- **`APP_READY` timing** — `#currentGroupMembers` is static HTML in ST's `index.html`, so it exists when `APP_READY` fires. No `MutationObserver` needed.

## ST Context API

Available via `SillyTavern.getContext()`:

| Property | Type | Notes |
|---|---|---|
| `groupId` | `string \| null` | Current group ID, null if not in a group |
| `groups` | `Group[]` | All groups with `members` and `disabled_members` |
| `getRequestHeaders()` | `Record<string, string>` | Auth headers for REST calls |
| `eventSource` | `EventSource` | ST event bus |
| `eventTypes` | `object` | Event name constants (`APP_READY`, etc.) |

## TypeScript

- Target: ES2020, module: ESNext, moduleResolution: Bundler.
- Ambient module declarations for `.html` and `.css` imports live in `src/declarations.d.ts`.
- `global.d.ts` imports ST's global types (resolved when installed in the ST extensions directory).
- jQuery (`$`) and `SillyTavern` are declared as ambient globals in `src/index.ts` — they exist at runtime in the ST browser environment.

## Files

| File | Purpose |
|---|---|
| `src/index.ts` | All logic — toggle, DOM injection, event wiring |
| `src/buttons.html` | Button markup template |
| `src/style.css` | Button bar layout styles |
| `src/declarations.d.ts` | Module declarations for html/css imports |
| `manifest.json` | ST extension manifest |
| `global.d.ts` | ST global type imports |
