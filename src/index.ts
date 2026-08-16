export * from "./types";
export * from "./host";
export { parseHTML } from "./dom";
export * from "./utils";

import type { ErrorCode, PluginResult } from "./types";

export function ok<T>(data: T): PluginResult<T> {
  return { ok: true, data };
}

export function fail<T = never>(code: ErrorCode, message: string): PluginResult<T> {
  return { ok: false, error: { code, message } };
}