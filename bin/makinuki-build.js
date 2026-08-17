#!/usr/bin/env node
"use strict";

const path = require("node:path");
const fs = require("node:fs");
const { spawnSync } = require("node:child_process");
const { build } = require("esbuild");

const USAGE = `Usage: makinuki-build <input.ts|js> [options]

Options:
  -i, --interface <file>  TypeScript interface file describing exports and host imports (default: src/index.d.ts)
  -o, --output <file>     Output .wasm path (default: dist/plugin.wasm)
      --skip-opt          Skip the final wasm-opt optimization pass
  -h, --help              Show this help
`;

function parseArgs(argv) {
  const args = { input: null, interface: "src/index.d.ts", output: "dist/plugin.wasm", skipOpt: false };
  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === "-h" || arg === "--help") {
      console.log(USAGE);
      process.exit(0);
    }
    if (arg === "-i" || arg === "--interface") {
      args.interface = argv[++i];
      continue;
    }
    if (arg === "-o" || arg === "--output") {
      args.output = argv[++i];
      continue;
    }
    if (arg === "--skip-opt") {
      args.skipOpt = true;
      continue;
    }
    if (args.input === null) {
      args.input = arg;
    }
  }
  if (args.input === null) {
    console.error(USAGE);
    process.exit(1);
  }
  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const outDir = path.dirname(path.resolve(args.output));
  const bundleFile = path.join(outDir, "." + path.basename(args.output, ".wasm") + ".bundle.js");

  fs.mkdirSync(outDir, { recursive: true });

  try {
    await build({
      entryPoints: [path.resolve(args.input)],
      outfile: bundleFile,
      bundle: true,
      format: "cjs",
      target: ["es2020"],
      platform: "neutral",
      mainFields: ["main", "module"],
      legalComments: "none",
    });
  } catch (err) {
    console.error("esbuild failed:", err.message);
    process.exit(1);
  }

  const compilerArgs = [bundleFile, "-i", path.resolve(args.interface), "-o", path.resolve(args.output)];
  if (args.skipOpt) {
    compilerArgs.push("--skip-opt");
  }

  const result = spawnSync("extism-js", compilerArgs, { stdio: "inherit" });
  fs.rmSync(bundleFile, { force: true });

  if (result.error) {
    if (result.error.code === "ENOENT") {
      console.error(
        "extism-js was not found on PATH. Install the extism-js compiler and binaryen tools (wasm-merge, wasm-opt); see the pdk-ts README for setup instructions."
      );
    } else {
      console.error(result.error.message);
    }
    process.exit(1);
  }
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

main();