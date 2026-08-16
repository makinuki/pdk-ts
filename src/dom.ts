import * as cheerio from "cheerio";

export function parseHTML(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}