// (SONG OBJECT FORMAT):

// {
//       songID: 1104 // used as hashmap key.
//       streamID: "(stream URL)",
//       name: 'let there be light again',
//       artist: 'sunset rollercoaster',
//       date: '2022-01-01',
//       length: 400,
//       source: 'spotify',
//       albumCover: "(some-image-URL)",
//       isFavorited: true
// }

// (PLAYLIST OBJECT FORMAT):

// {
//   playlistID: 1004,
//   name: 'songs',
//   artist: 'User',
//   date: '2023-06-09',
//   length: 812,
//   albumCover: "(some-image-URL)",
//   isFavorited: false,
//   songs: [...]
// }


// ============================================================>
// Action creators                                             |
// ============================================================>

/*
ACTIONS:

createPlaylist:         {type: ..., payload: {name, initialSongs}}
deletePlaylist:         {type: ..., payload: {playlistID}}
renamePlaylist:         {type: ..., payload: {playlistID, name}}
toggleFavoritePlaylist: {type: ..., payload: {playlistID}}
updateAlbumLength:      {type: ..., payload: {songLength}}
changeAlbumCover:       {type: ..., payload: {playlistID, imageURL}}

addSong:                {type: ..., payload: {playlistID, songID}}
removeSong:             {type: ..., payload: {playlistID, songID}}
getSong:                {type: ..., payload: {playlistID, songID}}    
toggleFavoriteSong:     {type: ..., payload: {songID}}

*/

export const CREATEPLAYLIST = 'CREATEPLAYLIST';
export const DELETEPLAYLIST = 'DELETEPLAYLIST';
export const RENAMEPLAYLIST = 'RENAMEPLAYLIST';
export const TOGGLEFAVORITEPLAYLIST = 'TOGGLEFAVORITEPLAYLIST';
export const UPDATEALBUMLENGTH = 'UPDATEALBUMLENGTH';
export const CHANGEALBUMCOVER = 'CHANGEALBUMCOVER';

export const ADDSONG = 'ADDSONG';
export const REMOVESONG = 'REMOVESONG';
export const GETSONG = 'GETSONG';
export const TOGGLEFAVORITESONG = 'TOGGLEFAVORITESONG';






// when user adds a song to a playlist, try to write it to the database IF: 
// 1) the song does not already exist in the pool of songs in database.
export const addSong = (playlistID, songID) => ({
  type: ADDSONG,
  payload: {
    playlistID: playlistID,
    songID: songID
  }
});

// remove song from playlist, but not database.
export const removeSong = (playlistID, songID) => ({
  type: REMOVESONG,
  payload: {
    playlistID: playlistID,
    songID: songID
  }
});

export const getSong = (playlistID, songID) => ({
  type: GETSONG,
  payload: {
    playlistID: playlistID,
    songID: songID
  }
});

export const toggleFavoriteSong = (songID) => ({
  type: TOGGLEFAVORITESONG,
  payload: {
    songID: songID
  }
});

