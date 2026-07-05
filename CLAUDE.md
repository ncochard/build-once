# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`build-once` is a CLI utility that skips re-running a build script (e.g. `npm run build`) if nothing under the configured `input`/`output` globs has changed since the last run. It hashes the matched files and compares against a stored hash in a `.build-once` folder; if hashes match, the wrapped script is skipped, otherwise it runs and the hashes are refreshed.

This is a Yarn/Turbo monorepo (`yarn@4.0.1`, workspaces) with three packages:

- `packages/build-once` — the CLI itself.
- `packages/build-once-plugin` — defines the plugin contract (`Plugin`, `pluginFactory`, `Globs`, `Logger` types) that `build-once` and third-party plugins depend on.
- `packages/build-once-plugin-link` — an official plugin (`build-once-plugin-link`) that auto-detects `node_modules` symlinks (e.g. monorepo workspace links) and adds them to the `input` globs, so a package is rebuilt when a linked dependency changes.

## Commands

Run from the repo root (uses `turbo run ...`, respecting the workspace dependency graph and caching):

```
yarn build   # tsc build for every package
yarn clean   # rimraf dist for every package
yarn lint    # eslint --fix for every package
```

Per-package (inside `packages/<name>`):

```
yarn build   # tsc
yarn watch   # tsc --watch
yarn lint    # eslint src/ --fix
yarn clean   # rimraf dist
```

There is no test suite in this repo currently.

`prebuild` in each package runs `lint` automatically before `build`, so `yarn build` will fail if lint fails.

## Architecture: the `build-once` pipeline

Entry point: `packages/build-once/bin/build-once.js` → requires compiled `dist/build-once.js`. The source orchestration lives in `packages/build-once/src/build-once.ts`, run as a single linear pipeline:

1. `command.ts` — parses CLI args (`--script`, `--debug`) via `commander`.
2. `configuration.ts` — loads the `build-once` section of the consuming project's `package.json` via `cosmiconfig`, keyed by the script name.
3. `load-plugins.ts` — dynamically `import()`s each plugin named in `config.use` (resolved as `build-once-plugin-<name>`, e.g. `"use": ["link"]` → `build-once-plugin-link`) and instantiates it via its exported `plugin(options)` factory.
4. `get-globs.ts` — merges the config's own `input`/`output` globs with the `Globs` each plugin's `getGlobs()` contributes.
5. `file-system.ts` — expands the globs (via `globby`) into an actual file list.
6. `get-hash.ts` — computes the combined hash (see `hashAlgorithm`) of all matched files.
7. `hashes-cache.ts` — loads the previously stored hash for this `script` from `.build-once`.
8. If old and new hashes match (`utility.ts#same`) → skip and log via `feedback.ts`. Otherwise:
9. `execute-task.ts` — runs the real script (`npm run <script>` or `yarn run <script>`, per `config.command`) via `execa`.
10. `after-task.ts` — on success, recomputes and persists the new hashes to `.build-once` (`updateCache`). On failure, exits with the script's exit code.

When extending or debugging this pipeline, the `--debug` flag causes `.build-once` to also dump the list of scanned files — useful for diagnosing glob configuration issues.

## Plugin contract

Plugins implement the `Plugin` interface from `build-once-plugin` (`packages/build-once-plugin/src/index.ts`): an optional async `getGlobs(): Promise<Globs>` that returns extra `input`/`output` globs to merge in. A plugin package's entry point exports a `plugin(options: PluginOptions): Plugin` factory, where `PluginOptions` carries the shared `Logger`. See `packages/build-once-plugin-link/src/index.ts` for the reference implementation (`LinkPlugin`), which composes `get-dependencies.ts` (resolve workspace deps), `get-link.ts` (resolve their symlink targets), and `get-globs.ts` (turn link targets into globs).

Important constraint called out in the README: never glob the whole `node_modules` folder for `input` — it's far too slow. Plugins/configs should target specific known paths (e.g. a dependency's own `.build-once` output) instead.
