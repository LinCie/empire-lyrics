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

      if (!song) return null;

      return {
        fullTitle: song.fullTitle,
        title: song.title,
        artist: song.artist.name,
        artistLink: song.artist.url,
        url: song.url,
        lyrics: await song.lyrics(),
        image: song.image,
        thumbnail: song.thumbnail,
        releasedAt: song.releasedAt,
      };
    } catch (error) {
      console.error("Error while fetching song:", error);
      throw new Error("Error while fetching song data.");
    }
  }
}

export { Genius };
