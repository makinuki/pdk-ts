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

## Writing a safe plugin

The bundle runs in a WebAssembly sandbox with no Node.js or browser APIs.
Keep these constraints in mind:

- DOM parsing dependencies must be WASM-safe builds. `cheerio/slim` (the
  htmlparser2 backend) bundles cleanly; full `cheerio` drags in `undici`,
  `encoding-sniffer`, and `iconv-lite`, which import `node:*` builtins and
  fail esbuild bundling under `platform: neutral`. Never import packages that
  pull Node.js builtins transitively.
- The build resolves packages through the `main` and `module` fields.
  Dependencies exposing only a TypeScript entry point must ship a JS
  `main` or `module` field.
- Live-host testing uses Extism async host functions, which require
  WebAssembly Suspending (JSPI). Node 22 keeps JSPI behind the
  `--experimental-wasm-jspi` flag; run harnesses and local runners with
  `node --experimental-wasm-jspi`.
- TypeScript 7 (native type stripping) does not auto-include `@types/node`
  even when installed. Any tsconfig compiling scripts that use Node.js APIs
  must set `"types": ["node"]` explicitly.

## Development

- `pnpm typecheck` runs the TypeScript compiler across `src` and `template`.