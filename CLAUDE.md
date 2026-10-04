# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

A small Express REST API (users + health check) with an in-memory data store, used as the starter project for a Claude Code course.

## Commands

- `npm run dev`: start the API on http://localhost:3000 with auto-restart (`node --watch`)
- `npm test`: run all tests (Node's built-in test runner)
- `node --test --test-name-pattern="health"`: run only the tests whose name matches
- `npm run lint`: ESLint over the whole repo

CI (`.github/workflows/ci.yml`) runs `npm run lint` and then `npm test` on Node 22, so both must pass before pushing.

## Architecture

- `server.js` builds the Express `app`, mounts one router per resource and exports `app`. It only calls `listen()` when run directly (`require.main === module`), so tests can import `app` without opening a port.
- `routes/`: one file per resource (`users.js` → `/users`, `health.js` → `/health`), each exporting an `express.Router()`. A new resource gets its own file plus an `app.use()` line in `server.js`.
- `db/store.js`: the only place that touches data. Routes call its functions and never hold data themselves. It is in-memory, so data resets on every restart and tests share state within a run.
- Config comes from `process.env` (only `PORT` today). Nothing loads `.env` automatically: there is no dotenv.

## Conventions

- Use CommonJS (`require` / `module.exports`), not ES modules (`import` / `export`): ESLint is configured with `sourceType: "script"`.
- Use `node:test` + `node:assert` + `supertest` against the imported `app`, not Jest or Mocha. Put tests in `tests/` as `*.test.js`.
- Use 2-space indentation, not tabs. Use double quotes, not single quotes, and always end statements with semicolons.
- Access data through the functions in `db/store.js`, not by keeping arrays or objects inside route files.
- Return errors as JSON `{ error: "message" }` with a proper status code (400 for invalid input, 404 for not found), not plain text. Return 201 on create.
- Convert route params with `Number(req.params.id)` before use, not as raw strings: the store compares ids with `===`.
- Start each route handler with a comment naming the method and path, e.g. `// GET /users/:id — fetch a single user`.
- Name files in lowercase with hyphens, not camelCase. Write code, comments and variable names in English.
