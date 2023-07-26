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
import { getSpotifyAsync, getYoutubeAsync } from './redux/thunks';
import debounce from 'lodash.debounce';
// import ScrollingComponent from './ScrollingComponent';




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






  const dispatch = useDispatch();

  const performSearch = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, 400);

  useEffect(() => {
    console.log("calling it with " + searchTerm)
    if (searchTerm === '') return; // make it load recommended songs from spotify
    dispatch(getSpotifyAsync({accessToken:accessToken, query:searchTerm}));
    dispatch(getYoutubeAsync({query:searchTerm}));
  }, [searchTerm]);




  const playlistCreatorRef = useRef(null);


  const closeCreator = () => {
    setCreatorVisible(false);
  }

  const handleAddClick = () => {
    setCreatorVisible(true);
  }


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
            key={song.link}
            thumbnailUrl={song.imageLink}
            songName={song.name}
            artistName={song.artist}
            views={song.views + ' streams'}
            duration={song.duration}
            songLink={song.link}
            platform='Spotify'
            handleAddClick={handleAddClick}
            playlistCreatorRef={playlistCreatorRef}
            songObject={song}
          />
        ))}
      </div>

      <div className='spotify-albums'>
        <h2 className='heading'>Spotify Albums</h2>
        <div className='spotify-album-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>

        {spotifyAlbums.map((album) => (
          <PlaylistResult
            className={'spotify-album-preview'}
            key={album.originSpotifyId}
            thumbnailUrl={album.coverImageURL}
            playlistName={album.name}
            artistName={album.author}
            views={album.popularity + ' views'}
            playlistLink={album.originSpotifyId}
          />
        ))}
        </div>
      </div>

      <div className='spotify-playlists'>
        <h2 className='heading'>Spotify Playlists</h2>
        <div className='spotify-playlist-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
        {spotifyPlaylists.map((playlist) => (
          <PlaylistResult
            className={'spotify-playlist-preview'}
            key={playlist.originSpotifyId}
            thumbnailUrl={playlist.coverImageURL}
            playlistName={playlist.name}
            artistName={playlist.author}
            views={0 + ' views'}
            playlistLink={playlist.originSpotifyId}
          />
        ))}
          </div>
          </div>
        
        <div className='youtube-videos'>
        <h2 className='heading'>Youtube Videos</h2>
        <div className='youtube-video-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
        {youtubeVideos.map((song) => (
          <SongResult
            className={'youtube-preview'}
            key={song.link}
            thumbnailUrl={song.imageLink}
            songName={song.name}
            artistName={song.artist}
            views={song.views + ' views'}
            duration={song.duration}
            songLink={song.link}
            platform='Youtube'
          />
        ))}
        
        </div>
      </div>

      <div className='youtube-playlists'>
        <h2 className='heading'>Youtube Playlists</h2>
        <div className='youtube-playlist-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
        {youtubePlaylists.map((playlist) => (
          <PlaylistResult
            className={'youtube-playlist-preview'}
            key={playlist.name}
            thumbnailUrl={playlist.coverImageURL}
            playlistName={playlist.name}
            artistName={playlist.author}
            songs={[]}
            // views={song.views + ' views'}
            // duration={song.duration}
            playlistLink={playlist.originId}
          />
        ))}
          </div>
          </div> 
{/*
        <div className='unifi-playlists'>
        <h2 className='heading'>Uni.fi Playlists</h2>
        <div className='unifi-playlist-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
          </div>
        </div>
         */}

    </div>
  );
};


export default SearchPage;
