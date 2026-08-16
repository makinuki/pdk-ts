/// <reference path="../template/index.d.ts" />

import type { HttpRequest, HttpResponse, HttpError } from "./types";

type HostFn = (ptr: I64) => I64;

function hostFunctions(): Record<string, HostFn> {
  return Host.getFunctions() as Record<string, HostFn>;
}

function callHost(name: string, payload: string): string {
  const fn = hostFunctions()[name];
  if (!fn) {
    throw new Error(`host function ${name} is not available`);
  }
  const mem = Memory.fromString(payload);
  const ret = fn(mem.offset);
  return Memory.find(ret).readString();
}

export class MakiNukiHttpError extends Error {
  readonly code: string;
  readonly status?: number;
  readonly url?: string;

  constructor(payload: HttpError) {
    super(payload.message ?? payload.error);
    this.code = payload.error;
    this.status = payload.status;
    this.url = payload.url;
  }
}

export function fetch(req: HttpRequest): HttpResponse {
  const raw = callHost("makinuki_fetch", JSON.stringify(req));
  const parsed = JSON.parse(raw) as HttpResponse | HttpError;
  if (parsed && typeof parsed === "object" && "error" in parsed) {
    throw new MakiNukiHttpError(parsed);
  }
  return parsed as HttpResponse;
}

export function storageGet(key: string): string | null {
  const fn = hostFunctions()["makinuki_storage_get"];
  if (!fn) {
    throw new Error("host function makinuki_storage_get is not available");
  }
  const mem = Memory.fromString(JSON.stringify(key));
  let ret: I64;
  try {
    ret = fn(mem.offset);
  } catch {
    return null;
  }
  if (ret === 0n || ret === 0) {
    return null;
  }
  return Memory.find(ret).readString();
}

export function storageSet(key: string, value: string): void {
  callHost("makinuki_storage_set", JSON.stringify({ key, value }));
}

export type LogLevel = "debug" | "info" | "warn" | "error";

export function log(level: LogLevel, message: string): void {
  callHost("makinuki_log", JSON.stringify({ level, message }));
}