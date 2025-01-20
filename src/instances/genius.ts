import GeniusClient from "genius-lyrics";

class Genius {
  public readonly key: string;
  public readonly genius: GeniusClient.Client;

  constructor() {
    this.key = import.meta.env.GENIUS_KEY;
    this.genius = new GeniusClient.Client(this.key);
  }

  public async searchSong(query: string) {
    const URI = encodeURI(query);

    try {
      const response = await this.genius.songs.search(URI);
      const song = response.shift();
      const lyrics = await song?.lyrics();
      return { song, lyrics };
    } catch (error) {
      console.error("Error while fetching song:", error);
      throw new Error("Error while fetching song data.");
    }
  }
}

export { Genius };
