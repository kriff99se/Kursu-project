# Notes

## CLAUDE.md: what I kept and what I cut

I kept four parts: a one-line description, the commands, the architecture and the conventions.

- **Commands:** `npm run dev`, `npm test` and `npm run lint`, plus how to run a single test with `--test-name-pattern`. I also noted that CI runs lint and then tests, so Claude knows both must pass before a push.
- **Architecture:** only what takes several files to understand. `server.js` exports `app` and only listens when run directly, so tests can import it. There is one router per resource in `routes/`, all data goes through `db/store.js`, and `.env` is not loaded automatically.
- **Conventions:** rules written as "use X, not Y" (CommonJS not ES modules, `node:test` not Jest, data through the store not inside routes, and so on), so Claude can follow them without asking. I took them from the existing code and the ESLint config.

I deliberately left out:

- **A full file list:** Claude can see the files itself, and a list goes out of date.
- **Generic advice** like "write clean code": it doesn't change what Claude does.
- **The course task steps:** they are one-off instructions, not facts about the project.
- **Anything from `.env`:** secrets don't belong in a file that is committed and loaded into every session.

## Permission rules

- **allow:** `npm test`, `npm run lint`, `git status`, `git diff` and `git log`. I run these often, and they only read or check code, so asking every time would just slow things down.
- **ask:** `git push`. A push publishes code to GitHub, so I want to approve it myself each time.
- **deny:** reading or editing `.env`, and `git push --force` / `git push -f`.

Without the deny rules, Claude could read `.env` and real secrets (passwords, database URLs) could end up in the conversation or a commit. A force-push could overwrite commits on GitHub, including other people's work, and that is hard to undo. Deny wins over ask, so a force-push is blocked even though a normal push only needs approval.

One limitation: the force-push rules match on the start of the command, so `git push origin main --force` would not be caught.

I also fixed `.gitignore`. Leading spaces meant `.env` and `.claude/settings.local.json` weren't actually ignored, so my personal settings could have been committed by accident.

## Verification

I checked both in a fresh Claude Code session:

- `/memory` shows the project `CLAUDE.md` as loaded.
- `/permissions` shows my allow, ask and deny rules from `.claude/settings.json`.
