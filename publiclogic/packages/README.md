# packages/ — Shared infrastructure

Cross-cutting infrastructure used by the runtime, capabilities, and apps.

Planned structure:

- `database/` · `auth/` · `logging/` · `config/`
- `types/` · `utilities/` · `testing/` · `sdk/`

Existing stubs (`shared/`, `ui/`, `vault/`, `casespace/`) and the working
packages (`pj/`, `golden-path/`, `kpl-casespace/`) live here today; they migrate
to their target homes (`runtime/`, `doctrine/`, `models/`, `capabilities/`) as
each is built out. See `../ARCHITECTURE.md`.
