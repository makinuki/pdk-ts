import * as cheerio from "cheerio/slim";

export function parseHTML(html: string): cheerio.CheerioAPI {
  return cheerio.load(html);
}