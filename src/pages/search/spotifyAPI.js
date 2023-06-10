import SpotifyWebApi from 'spotify-web-api-js';
import Sentiment from 'sentiment';
import tm from 'tm';

const spotifyApi = new SpotifyWebApi();
const sentiment = new Sentiment();

const analyzeSentiment = (text) => {
  const result = sentiment.analyze(text);
  return result;
};

const generateTags = (texts, numTopics) => {
  const lda = new tm.LDA();

  const documents = texts.map((text) => new tm.Document(text));
  const corpus = new tm.Corpus(documents);

  corpus
    .clean()
    .removeInterpunctuation()
    .toLower()
    .removeWords(tm.STOPWORDS.EN)
    .stem()
    .removeEmptyDocuments();

  lda.addDocuments(corpus);

  lda.train(numTopics, 50, 0.1, 0.1);

  const tags = texts.map((text) => {
    const document = new tm.Document(text);
    document
      .clean()
      .removeInterpunctuation()
      .toLower()
      .removeWords(tm.STOPWORDS.EN)
      .stem();

    const topicDistribution = lda.infer(document);
    const topTopics = topicDistribution
      .sort((a, b) => b.probability - a.probability)
      .slice(0, 3)
      .map((topic) => topic.term);

    return topTopics;
  });

  return tags;
};

const getArtistGenres = async (artistId) => {
  try {
    const response = await spotifyApi.getArtist(artistId);
    return response.genres;
  } catch (error) {
    console.error('Error retrieving artist genres:', error);
    return [];
  }
};

const searchSpotifySongs = async (searchTerm) => {
  try {
    const response = await spotifyApi.searchTracks(searchTerm);
    const titles = response.tracks.items.map((track) => track.name);
    const tags = generateTags(titles, 3);

    const tracks = response.tracks.items.map(async (track, index) => {
      const analysis = analyzeSentiment(track.name);
      const artistGenres = await getArtistGenres(track.artists[0].id);
      const genreTags = artistGenres.map((genre) => genre.toLowerCase());

      return {
        id: track.id,
        title: track.name,
        author: track.artists[0].name,
        streams: track.popularity,
        sentiment: analysis.score,
        sentimentComparative: analysis.comparative,
        sentimentPositive: analysis.positive,
        sentimentNegative: analysis.negative,
        tags: [...tags[index], ...genreTags],
      };
    });

    return Promise.all(tracks);
  } catch (error) {
    console.error('Error searching Spotify songs:', error);
    return [];
  }
};

const searchSpotifyPlaylists = async (searchTerm) => {
  try {
    const response = await spotifyApi.searchPlaylists(searchTerm);
    const titles = response.playlists.items.map((playlist) => playlist.name);
    const tags = generateTags(titles, 3);

    const playlists = response.playlists.items.map(async (playlist, index) => {
      const analysis = analyzeSentiment(playlist.name);
      const genreTags = await getPlaylistGenres(playlist.id);

      return {
        id: playlist.id,
        title: playlist.name,
        author: playlist.owner.display_name,
        tracks: playlist.tracks.total,
        sentiment: analysis.score,
        sentimentComparative: analysis.comparative,
        sentimentPositive: analysis.positive,
        sentimentNegative: analysis.negative,
        tags: [...tags[index], ...genreTags],
      };
    });

    return Promise.all(playlists);
  } catch (error) {
    console.error('Error searching Spotify playlists:', error);
    return [];
  }
};

const getPlaylistGenres = async (playlistId) => {
  try {
    const response = await spotifyApi.getPlaylist(playlistId);
    const trackItems = response.tracks.items;
    const artistIds = trackItems.flatMap((track) =>
      track.track.artists.map((artist) => artist.id)
    );

    const artistGenres = await Promise.all(
      Array.from(new Set(artistIds)).map((artistId) =>
        getArtistGenres(artistId)
      )
    );

    const genreTags = artistGenres
      .flat()
      .map((genre) => genre.toLowerCase());

    return genreTags;
  } catch (error) {
    console.error('Error retrieving playlist genres:', error);
    return [];
  }
};

export { searchSpotifySongs, searchSpotifyPlaylists };
