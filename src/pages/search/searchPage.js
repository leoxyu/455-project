import React, { useState, useEffect} from 'react';
// import { searchSpotifySongs, searchSpotifyPlaylists } from './spotifyAPI';
// import { searchYouTubeVideos, searchYouTubePlaylists } from './youtubeAPI';
import '../../styles/variables.css';

import '../../styles/searchPage.css';
import SearchBar from './components/SearchBar';
import SongResult from './components/SongResult';


const SearchPage = () => {

  useEffect(() => {
    document.title = "Uni.fi - Search"; // Change the webpage title

    // Clean up the effect
    
  }, []);

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


  const spotifySongList = [
    {
      thumbnailUrl: 'https://i.scdn.co/image/ab67616d0000b273fa9247b68471b82d2125651e',
      songName: 'Haegeum',
      artistName: 'Agust D',
      views: '123456',
      duration: '1:53',
      songLink: 'https://open.spotify.com/track/4bjN59DRXFRxBE1g5ne6B1?si=d40939f4f897437d'
    },
    {
      thumbnailUrl: 'https://i1.sndcdn.com/artworks-Vi8kWdDLyiHb-0-t500x500.jpg',
      songName: 'One Dance',
      artistName: 'Drake',
      views: '6942000',
      duration: '2:53',
      songLink: 'https://open.spotify.com/track/1zi7xx7UVEFkmKfv06H8x0?si=d0226490edb4470b'
    },
    {
      thumbnailUrl: 'https://static.wikia.nocookie.net/the-bangtan-boys/images/f/fb/Love_Yourself_%27Tear%27_album_cover.jpg',
      songName: 'FAKE LOVEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
      artistName: 'BTS',
      views: '34100000',
      duration: '4:02',
      songLink: 'https://open.spotify.com/track/6m1TWFMeon7ai9XLOzdbiR?si=85e1028488b9479c'
    },
    {
      thumbnailUrl: 'https://i.ytimg.com/vi/MAihF124EbE/maxresdefault.jpg',
      songName: 'Sugar',
      artistName: 'Maroon 5',
      views: '20001000',
      duration: '3:55',
      songLink: 'https://open.spotify.com/track/2iuZJX9X9P0GKaE93xcPjk?si=3a866fb1a7ec4062'
    }
  ]



  return (
    <div className='search-page'>
      {/* <h1> search page is here</h1> */}
      <SearchBar />
      <div className='spotify-songs'>
        <h2 className='heading'>Spotify Songs</h2>
        {spotifySongList.map((song) => (
          <SongResult
            className='spotify-preview'
            key={song.songName}
            thumbnailUrl={song.thumbnailUrl}
            songName={song.songName}
            artistName={song.artistName}
            views={song.views + ' streams'}
            duration={song.duration}
            songLink={song.songLink}
          />
        ))}
      </div>
      <div className='youtube-videos'>
        <h2 className='heading'>Youtube Videos</h2>
        {spotifySongList.map((song) => (
          <SongResult
            className={'youtube-preview'}
            key={song.songName}
            thumbnailUrl={song.thumbnailUrl}
            songName={song.songName}
            artistName={song.artistName}
            views={song.views + ' views'}
            duration={song.duration}
            songLink={song.songLink}
          />
        ))}
      </div>
      {/* <SongResult 
      thumbnailUrl='https://i.scdn.co/image/ab67616d0000b273fa9247b68471b82d2125651e'
       songName='Haegeum' 
       artistName='Agust D' 
       views='123456' 
       duration='1:53'
       songLink='https://open.spotify.com/track/4bjN59DRXFRxBE1g5ne6B1?si=d40939f4f897437d'/> */}
      {/* <div className='search-bar'>
        <input
          className='input'
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className='button' onClick={handleSearch}>Search</button>
      </div> */}

{/* 
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
      </div>  */}
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
