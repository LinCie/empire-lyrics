import got from "got";
import { ZenRows } from "zenrows";
import * as cheerio from "cheerio"; // Import Cheerio for parsing HTML
import type { GeniusApiResponse } from "../types/geniusapiresponse";

class Genius {
  public readonly key: string;

  constructor() {
    // Access environment variables for keys
    this.key = import.meta.env.GENIUS_KEY;
  }

  public async searchSong(query: string) {
    const URI = encodeURI(query);

    try {
      // Fetch song data from Genius API
      const response = await got
        .get("https://api.genius.com/search?q=" + URI, {
          headers: { Authorization: "Bearer " + this.key },
        })
        .json<GeniusApiResponse>();

      // Get the first song result
      const song = response.response.hits.shift();

      if (!song) {
        throw new Error("No song found for the given query.");
      }

      // Fetch the lyrics using the song URL
      const lyrics = await this.getLyrics(song.result.url);

      return { song, lyrics };
    } catch (error) {
      console.error("Error while fetching song:", error);
      throw new Error("Error while fetching song data.");
    }
  }

  public async getLyrics(url: string) {
    const client = new ZenRows(import.meta.env.ZENROWS_KEY);

    try {
      // Fetch the page content using ZenRows
      const request = await client.get(url, { js_render: true }); // Enable JS rendering for dynamic content
      const html = await request.text();

      // Parse the HTML content
      const $ = cheerio.load(html);

      // Extract all divs within #lyrics-root containing data-lyrics-container="true"
      const lyricsDivs = $('#lyrics-root [data-lyrics-container="true"]')
        .map((_, el) => {
          // Get the text and remove unnecessary elements like <span>, <a>, etc.
          const text = $(el).text().trim();
          // Replace line breaks (<br>) with \n for better formatting
          return text.replace(/<br\s*\/?>/g, "\n");
        })
        .get(); // Convert to an array

      if (lyricsDivs.length === 0) {
        throw new Error("Lyrics container not found on the page.");
      }

      // Join the text content of all matched divs into a single string, separated by new lines
      const lyrics = lyricsDivs.join("\n").trim();

      // Clean extra whitespace, if any
      const cleanedLyrics = lyrics.replace(/\n+/g, "\n");

      return cleanedLyrics;
    } catch (error) {
      console.error("Error while fetching lyrics:", error);
      throw new Error("Error while fetching lyrics.");
    }
  }
}

export { Genius };
