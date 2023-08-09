export const actionTypes = {
  GET_SPOTIFY: 'spotify/get',
  GET_NEXT_SPOTIFY: 'spotify/getNext',
  GET_SPOTIFY_ALBUM_BY_ID: 'spotify/album/get',
  GET_SPOTIFY_PLAYLIST_BY_ID: 'spotify/playlist/get',
  GET_NEXT_SPOTIFY_COLLECTION_BY_ID: 'spotify/collection/getNext',

  GET_YOUTUBE: 'youtube/get',
  GET_NEXT_YOUTUBE: 'youtube/getNext',
  GET_YOUTUBE_PLAYLIST_BY_ID: 'youtube/playlist/get',
  IMPORT_YOUTUBE_PLAYLIST_BY_ID: 'youtube/playlist/import',
  // note: no pagination available for yt playlists

  GET_UNIFI: 'unifi/get',
  SET_SEARCH_TERM: 'searchTerm/set',
};
