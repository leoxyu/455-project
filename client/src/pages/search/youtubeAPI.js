import { google } from 'googleapis';
import Sentiment from 'sentiment';
import tm from 'tm';

const youtube = google.youtube('v3');
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

const searchYoutubeVideos = async (searchTerm) => {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: searchTerm,
      maxResults: 10,
      type: 'video',
    });

    const titles = response.data.items.map((item) => item.snippet.title);
    const tags = generateTags(titles, 3);

    const videos = response.data.items.map(async (item, index) => {
      const analysis = analyzeSentiment(item.snippet.title);
      const videoId = item.id.videoId;
      const viewCount = await getVideoViewCount(videoId);

      return {
        id: videoId,
        title: item.snippet.title,
        author: item.snippet.channelTitle,
        views: viewCount,
        sentiment: analysis.score,
        sentimentComparative: analysis.comparative,
        sentimentPositive: analysis.positive,
        sentimentNegative: analysis.negative,
        tags: tags[index],
      };
    });

    return Promise.all(videos);
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return [];
  }
};

const searchYoutubePlaylists = async (searchTerm) => {
  try {
    const response = await youtube.search.list({
      part: 'snippet',
      q: searchTerm,
      maxResults: 10,
      type: 'playlist',
    });

    const titles = response.data.items.map((item) => item.snippet.title);
    const tags = generateTags(titles, 3);

    const playlists = response.data.items.map(async (item, index) => {
      const analysis = analyzeSentiment(item.snippet.title);
      const playlistId = item.id.playlistId;
      const videoCount = await getPlaylistVideoCount(playlistId);

      return {
        id: playlistId,
        title: item.snippet.title,
        author: item.snippet.channelTitle,
        videos: videoCount,
        sentiment: analysis.score,
        sentimentComparative: analysis.comparative,
        sentimentPositive: analysis.positive,
        sentimentNegative: analysis.negative,
        tags: tags[index],
      };
    });

    return Promise.all(playlists);
  } catch (error) {
    console.error('Error searching YouTube playlists:', error);
    return [];
  }
};

const getVideoViewCount = async (videoId) => {
  try {
    const response = await youtube.videos.list({
      part: 'statistics',
      id: videoId,
    });

    const viewCount = response.data.items[0].statistics.viewCount;
    return viewCount;
  } catch (error) {
    console.error('Error retrieving video view count:', error);
    return 0;
  }
};

const getPlaylistVideoCount = async (playlistId) => {
  try {
    const response = await youtube.playlists.list({
      part: 'contentDetails',
      id: playlistId,
    });

    const videoCount = response.data.items[0].contentDetails.itemCount;
    return videoCount;
  } catch (error) {
    console.error('Error retrieving playlist video count:', error);
    return 0;
  }
};

export { searchYoutubeVideos, searchYoutubePlaylists };
