# Template Cursor

This project is a GitHub template repository designed to help you quickly set up a new project with best practices for environment management, script templating, and pre-commit hooks.

## Setup

1. **Clone the repository**
2. **Run the setup script:**
   ```bash
   ./setup.sh
   ```
   - You will be prompted for your GitHub Personal Access Token.
   - This will:
     - Copy `env.template` to `.env` in the root directory and set your token.
     - For each `*.template` script in `mcp_scripts/`, create a corresponding `*.sh` script with your token inserted where needed.

## Environment Variables

Environment variables are managed via `.env` files generated from `env.template`:

```
GITHUB_PAT=token
```

## Scripts

- All template scripts are in the `mcp_scripts/` directory as `*.template` files.
- After running `setup.sh`, you will have executable `*.sh` scripts in `mcp_scripts/` with your GitHub token inserted.
- Example:
  - `mcp_scripts/github-mcp.sh.template` → `mcp_scripts/github-mcp.sh`

## Makefile Commands

- `make init` — Installs pre-commit hooks.
- `make run-pre-commit` — Runs all pre-commit hooks on all files.

## Pre-commit Hooks

This project uses [pre-commit](https://pre-commit.com/) with the following hooks:
- trailing-whitespace
- end-of-file-fixer
- check-yaml
- check-json
- check-added-large-files

## Notes
- Do not commit your `.env` or any generated `*.sh` scripts in `mcp_scripts/` (these are gitignored).
- This template is designed for easy bootstrapping and secure token handling.
