export function resolveUrl(base: string, rel: string): string {
  try {
    return new URL(rel, base).toString();
  } catch {
    return rel;
  }
}

export function cleanText(value: string | null | undefined): string {
  if (value === null || value === undefined) {
    return "";
  }
  return value
    .replace(/\u00a0/g, " ")
    .replace(/<br\s*\/?>/gi, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function parseChapterNumber(text: string): number | null {
  const match = text.match(/(\d+(?:[.,]\d+)?)/);
  if (!match) {
    return null;
  }
  return Number(match[1].replace(",", "."));
}