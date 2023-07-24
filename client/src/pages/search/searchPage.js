import React, { useState, useEffect, useRef } from 'react';
// import { searchSpotifySongs, searchSpotifyPlaylists } from './spotifyAPI';
// import { searchYouTubeVideos, searchYouTubePlaylists } from './youtubeAPI';
import '../../styles/variables.css';

import '../../styles/searchPage.css';
import SearchBar from './components/SearchBar';
import SongResult from './components/SongResult';
import PlaylistResult from './components/PlaylistResult';
import Filters from './components/Filters';
import PlaylistCreator from '../playlists/components/PlaylistCreator';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotifyAsync } from './redux/thunks';
import debounce from 'lodash.debounce';
// import ScrollingComponent from './ScrollingComponent';


import { spotifyGetManyPlaylistsThunk } from '../../components/home/redux/thunks';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM, TYPE_TRACK } = require("../../typeConstants.js");



//  look here later: https://github.com/dermasmid/scrapetube
// also here: https://github.com/paulomcnally/youtube-node
const SearchPage = () => {

  useEffect(() => {
    document.title = "Uni.fi - Search"; // Change the webpage title



  }, []);

  const [creatorVisible, setCreatorVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const accessToken = useSelector(state => state.spotify.access_token);
  const spotifyTracks = useSelector(state => state.search.spotify.tracks);
  const spotifyPlaylists = useSelector(state => state.search.spotify.playlists);
  const spotifyAlbums = useSelector(state => state.search.spotify.albums);
  const youtubeVideos = useSelector(state => state.search.youtube.videos);
  const youtubePlaylists = useSelector(state => state.search.youtube.playlists);
  // users
  // artists

  // used to determine type of popup of options menu on playlist component
  const OPTIONS_TYPE3 = "SEARCH_RESULT_PLAYLIST";






  const dispatch = useDispatch();

  const performSearch = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, 400);

  useEffect(() => {
    console.log("calling it with " + searchTerm)
    if (searchTerm === '') return; // make it load recommended songs from spotify
    dispatch(getSpotifyAsync({ accessToken: accessToken, query: searchTerm }));
  }, [searchTerm]);




  const playlistCreatorRef = useRef(null);


  const closeCreator = () => {
    setCreatorVisible(false);
  }

  const handleAddClick = () => {
    setCreatorVisible(true);
  }

  const saveOnClick = (playlistLink, playlistType) => {

    console.log("Inside saveOnClick()");
    
    if (playlistLink && playlistType && typeof(playlistLink) === 'string') {

      const urlArray = playlistLink.split('/');

      const spotifyID = urlArray[urlArray.length - 1];

      const parsedPlaylistObject = {
        id: spotifyID,
        playlistType: playlistType
      }
      console.log(parsedPlaylistObject);
      console.log(accessToken);

      const parsedParam = {
        playlists: [parsedPlaylistObject], 
        accessToken
      };

      dispatch(spotifyGetManyPlaylistsThunk(parsedParam)).then((res) => {
        console.log("res: ");
        console.log(res);
      });



    } else {
      console.log("invalid playlist link or type (SAVE PLAYLIST ERROR inside saveOnClick()");
    }

    // make API call here...
  }



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
      songName: 'FAKE LOVE',
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
      <SearchBar placeholder='Search for songs, albums, artists...' searchCallback={(input) => { performSearch(input) }} />
      <Filters />
      {creatorVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistCreator onClose={closeCreator} ref={playlistCreatorRef} />
        </div>
      }

      <div className='spotify-songs'>
        <h2 className='heading'>Spotify Songs</h2>
        {spotifyTracks.map((song) => (
          <SongResult
            className='spotify-preview'
            key={song.songLink}
            thumbnailUrl={song.thumbnailUrl}
            songName={song.songName}
            artistName={song.artistName}
            artists={song.artists}
            duration={song.duration}
            songLink={song.songLink}
            platform={TYPE_SPOTIFY}
            handleAddClick={handleAddClick}
            playlistCreatorRef={playlistCreatorRef}
            songObject={song}

            isFavorite={false}
          />
        ))}
      </div>

      <div className='spotify-albums'>
        <h2 className='heading'>Spotify Albums</h2>
        <div className='spotify-album-list' style={{ display: 'flex', 'flex-wrap': 'wrap' }}>

          {spotifyAlbums.map((album) => (
            <PlaylistResult
              className={'spotify-album-preview'}
              key={album.playlistLink}
              thumbnailUrl={album.thumbnailUrl}
              playlistName={album.playlistName}
              artistName={album.artistName.join(', ')}
              views={album.popularity + ' views'}
              playlistLink={album.playlistLink}

              isFavorite={false}
              duration={album.duration}
              source={TYPE_SPOTIFY}
              type={TYPE_ALBUM}

              optionType={OPTIONS_TYPE3}
              saveOnClick={saveOnClick}
            />
          ))}
        </div>
      </div>

      <div className='spotify-playlists'>
        <h2 className='heading'>Spotify Playlists</h2>
        <div className='spotify-playlist-list' style={{ display: 'flex', 'flex-wrap': 'wrap' }}>
          {spotifyPlaylists.map((playlist) => (
            <PlaylistResult
              className={'spotify-playlist-preview'}
              key={playlist.playlistLink}
              thumbnailUrl={playlist.thumbnailUrl}
              playlistName={playlist.playlistName}
              artistName={playlist.artistName}
              views={0 + ' views'}
              playlistLink={playlist.playlistLink}

              isFavorite={false}
              duration={playlist.duration}
              source={TYPE_SPOTIFY}
              type={TYPE_PLAYLIST}

              optionType={OPTIONS_TYPE3}
              saveOnClick={saveOnClick}
            />
          ))}
        </div>
      </div>

      <div className='youtube-videos'>
        <h2 className='heading'>Youtube Videos</h2>
        <div className='youtube-video-list' style={{ display: 'flex', 'flex-wrap': 'wrap' }}>
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
              platform={TYPE_YOUTUBE}

              isFavorite={false}
            />
          ))}

        </div>
      </div>

      <div className='youtube-playlists'>
        <h2 className='heading'>Youtube Playlists</h2>
        <div className='youtube-playlist-list' style={{ display: 'flex', 'flex-wrap': 'wrap' }}>
          {spotifySongList.map((song) => (
            <PlaylistResult
              className={'youtube-playlist-preview'}
              key={song.songName}
              thumbnailUrl={song.thumbnailUrl}
              playlistName={song.songName}
              artistName={song.artistName}
              songs={spotifySongList}
              // views={song.views + ' views'}
              playlistLink={song.songLink}

              isFavorite={false}
              duration={song.duration}
              source={TYPE_YOUTUBE}
              type={TYPE_PLAYLIST}

              optionType={OPTIONS_TYPE3}
            />
          ))}
        </div>
      </div>
      {/*
          <div className='youtube-channels'>
        <h2 className='heading'>Youtube Channels</h2>
        <div className='youtube-channel-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
        </div>
        </div>

        <div className='spotify-artists'>
        <h2 className='heading'>Spotify Artists</h2>
        <div className='spotify-artist-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
          </div>
          </div>

        <div className='unifi-playlists'>
        <h2 className='heading'>Uni.fi Playlists</h2>
        <div className='unifi-playlist-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
          </div>
        </div>
         */}

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
