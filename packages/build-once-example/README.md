# build-once-example

A minimal project used to illustrate and validate the `build-once` utility,
wired up as a real workspace inside this monorepo (depends on `build-once`
the same way an external consumer would).

## What it does

`compile.js` stands in for a slow, real build step (`tsc`, `webpack`,
`babel`, ...): it copies every file in `src/` into `dist/`, stamping each
copy with the timestamp of the run. The `build-once` section of
`package.json` wraps that `compile` script, so it only runs when something
under `src/` (or `compile.js` itself) has changed since `dist/` was last
produced.

## Try it

From this folder (or via `yarn build` at the repo root, which runs every
workspace's `build` script through lerna):

```
yarn build                          # first run: nothing cached yet, so it compiles
yarn build                          # second run: unchanged -> build-once skips compiling
echo "// edit" >> src/index.js      # a real content change (touch alone won't do -
                                     # build-once hashes file contents, not mtime)
yarn build                          # third run: source changed -> compiles again
```

Compare the `/* built at ... */` timestamp at the top of `dist/index.js`
across runs to confirm whether `compile.js` actually re-ran or was skipped.

Pass `--debug` to see the full list of scanned files:

```
node_modules/.bin/build-once --script compile --debug
```

## Clean up

```
yarn clean        # removes dist/ and .build-once/
```
