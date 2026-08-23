# Changelog

All notable changes to the MakiNuki TypeScript PDK are recorded here. Contract changes follow the ABI versioning policy (spec, SPECIFICATION.md Section 7).

## [1.1.0] - 2026-08-23

- Added optional `allowedHosts?: string[]` to `SourceMetadata`, mirroring the spec addition that lets sources declare extra image/CDN hosts for transport allowlists.

## [1.0.0] - 2026-08-17

- Released in lockstep with spec v1.0.0 (ABI 1 frozen).
- The PDK implements the full ABI 1 surface: `makinuki_fetch`, `makinuki_storage_get`, `makinuki_storage_set`, `makinuki_log` host wrappers, static `get_metadata()` / `get_filters()` (raw JSON) and dynamic exports wrapped in `PluginResult<T>`, plus the `makinuki-build` CLI (esbuild bundle + extism-js compile).
- No API changes in this release; version aligns with the frozen ABI 1 baseline.
