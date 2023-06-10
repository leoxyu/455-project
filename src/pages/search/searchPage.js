import React, { useState } from 'react';
// import { searchSpotifySongs, searchSpotifyPlaylists } from './spotifyAPI';
// import { searchYouTubeVideos, searchYouTubePlaylists } from './youtubeAPI';
import '../../styles/searchPage.css';


const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [spotifySongs, setSpotifySongs] = useState(generateRandomSongs(5));
  const [spotifyPlaylists, setSpotifyPlaylists] = useState(generateRandomPlaylists(5));
  const [youtubeVideos, setYouTubeVideos] = useState(generateRandomVideos(5));
  const [youtubePlaylists, setYouTubePlaylists] = useState(generateRandomPlaylists(5));

  const handleSearch = async () => {
    // Call APIs to search for songs and playlists
    // const spotifySongsResult = await searchSpotifySongs(searchTerm);
    // const spotifyPlaylistsResult = await searchSpotifyPlaylists(searchTerm);
    // const youtubeVideosResult = await searchYouTubeVideos(searchTerm);
    // const youtubePlaylistsResult = await searchYouTubePlaylists(searchTerm);


    const spotifySongsResult = generateRandomSongs(5);
    const spotifyPlaylistsResult = generateRandomPlaylists(5);
    const youtubeVideosResult = generateRandomVideos(5);
    const youtubePlaylistsResult = generateRandomPlaylists(5);


    // Update the state with the search results
    setSpotifySongs(spotifySongsResult);
    setSpotifyPlaylists(spotifyPlaylistsResult);
    setYouTubeVideos(youtubeVideosResult);
    setYouTubePlaylists(youtubePlaylistsResult);
  };

  return (
    <div className='container'>

      <div className='search-bar'>
        <input
          className='input'
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='button' onClick={handleSearch}>Search</button>
      </div>


      <div className='results'>
        <h2 className='heading'>Search Results</h2>


        <div className='spotify'>
        <h3 className='spotify-heading'>Spotify</h3>
          <div className='section'>
            <h3 className='section-heading'>Songs</h3>
            {spotifySongs.map((song) => (
              <Preview
                key={song.id}
                title={song.title}
                author={song.author}
                views={song.streams}
                platform="Spotify"
              />
            ))}
          </div>

          <div className='section'>
            <h3 className='section-heading'>Playlists</h3>
            {spotifyPlaylists.map((playlist) => (
              <Preview
                key={playlist.id}
                title={playlist.title}
                author={playlist.author}
                views={playlist.streams}
                platform="Spotify"
              />
            ))}
          </div>
        </div>

        <div className='youtube'>
          <h3 className='youtube-heading'>YouTube</h3>
          <div className='section'>
            <h3 className='section-heading'>Videos</h3>
            {youtubeVideos.map((video) => (
              <Preview
                key={video.id}
                title={video.title}
                author={video.author}
                views={video.views}
                platform="YouTube"
              />
            ))}
          </div>

          <div className='section'>
            <h3 className='section-heading'>Playlists</h3>
            {youtubePlaylists.map((playlist) => (
              <Preview
                key={playlist.id}
                title={playlist.title}
                author={playlist.author}
                views={playlist.views}
                platform="YouTube"
              />
            ))}
          </div>
        </div>
      </div> 
    </div>
  );
};

const Preview = ({ title, author, views, platform }) => (
  <div className='preview'>
    <h4 className='preview-title'>{title}</h4>
    <p className='preview-author'>Author: {author}</p>
    <p className='preview-info'>Views/Streams: {views}</p>
    <p className='preview-platform'>Platform: {platform}</p>
  </div>
);


const generateRandomSongs = (count) => {
  const songs = [];
  for (let i = 0; i < count; i++) {
    const song = {
      id: i,
      title: `Song ${i}`,
      author: `Author ${i}`,
      streams: Math.floor(Math.random() * 1000000),
    };
    songs.push(song);
  }
  return songs;
};

const generateRandomPlaylists = (count) => {
  const playlists = [];
  for (let i = 0; i < count; i++) {
    const playlist = {
      id: i,
      title: `Playlist ${i}`,
      author: `Author ${i}`,
      streams: Math.floor(Math.random() * 1000000),
    };
    playlists.push(playlist);
  }
  return playlists;
};

const generateRandomVideos = (count) => {
  const videos = [];
  for (let i = 0; i < count; i++) {
    const video = {
      id: i,
      title: `Video ${i}`,
      author: `Author ${i}`,
      views: Math.floor(Math.random() * 1000000),
    };
    videos.push(video);
  }
  return videos;
};



export default SearchPage;
