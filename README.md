# @makinuki/pdk

TypeScript plugin development kit for MakiNuki. Compiles a scraper written in
TypeScript into a WebAssembly plugin that implements the MakiNuki ABI contract
(see [`makinuki/spec`](https://github.com/makinuki/spec)).

## Prerequisites

- Node.js 20 or newer
- The `extism-js` compiler on PATH, installed for your platform from
  https://github.com/extism/js-pdk/
- The binaryen `wasm-merge` and `wasm-opt` tools on PATH, installed for your
  platform from https://github.com/WebAssembly/binaryen/

## Building a plugin

```
pnpm add -D makinuki-build @makinuki/pdk
npx makinuki-build src/index.ts -i src/index.d.ts -o dist/plugin.wasm
```

The command bundles the TypeScript entry point (esbuild, CommonJS output),
then compiles it to a WASM plugin with `extism-js`. The interface file
(`-i`) declares the plugin exports and the host imports the plugin uses; a
starting point ships in `template/index.d.ts` of this package and should be
copied into each plugin project.

Derived build flags: `--skip-opt` skips the final optimization pass.

## Plugin structure

A MakiNuki plugin exports `get_metadata`, `get_filters`, `search`,
`get_details`, `get_pages`, and optionally `unscramble_image`, as defined in
the specification. Static exports return raw JSON; dynamic exports wrap their
payloads in the `PluginResult` envelope. Host services (`makinuki_fetch`,
`makinuki_storage_get`, `makinuki_storage_set`, `makinuki_log`) are exposed
through this package's host wrappers.

## Development

- `pnpm typecheck` runs the TypeScript compiler across `src` and `template`.