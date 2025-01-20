import got from "got";
import type { GeniusApiResponse } from "../types/geniusapiresponse";

class Genius {
  public readonly key: string;

  constructor() {
    this.key = import.meta.env.GENIUS_KEY;
  }

  public async searchSong(query: string) {
    const URI = encodeURI(query);
    try {
      const response = await got
        .get("https://api.genius.com/search?q=" + URI, {
          headers: { Authorization: "Bearer " + this.key },
        })
        .json<GeniusApiResponse>();
      const song = response.response.hits.shift();
      return song?.result;
    } catch (error) {
      throw new Error("Error while fetching lyrics");
    }
  }
}

export { Genius };
