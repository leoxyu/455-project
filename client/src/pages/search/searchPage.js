import React, { useState, useEffect, useRef } from 'react';
import '../../styles/variables.css';

import '../../styles/searchPage.css';
import SearchBar from './components/SearchBar';
import SongResult from './components/SongResult';
import PlaylistResult from './components/PlaylistResult';
import Filters from './components/Filters';
import PlaylistCreator from '../playlists/components/PlaylistCreator';
import { useSelector, useDispatch } from 'react-redux';
import { getSpotifyAsync, getYoutubeAsync, getYoutubePlaylistByIDAsync } from './redux/thunks';
import debounce from 'lodash.debounce';

import { createPlaylistAsync, spotifyGetManyPlaylistsThunk } from '../../components/home/redux/thunks';
import { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_ALBUM, TYPE_PLAYLIST, TYPE_TRACK, OPTIONS_TYPE3, OPTIONS_TYPE2 } from '../../typeConstants';




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
  const authorID = useSelector(state => state.login.authorID);

  // artists
  const dispatch = useDispatch();

  const performSearch = debounce((searchTerm) => {
    setSearchTerm(searchTerm);
  }, 400);

  useEffect(() => {
    console.log("calling it with " + searchTerm)
    if (searchTerm === '') return; // make it load recommended songs from spotify
    dispatch(getSpotifyAsync({ accessToken: accessToken, query: searchTerm }));
    dispatch(getYoutubeAsync({ query: searchTerm }));
  }, [searchTerm]);




  const playlistCreatorRef = useRef(null);


  const closeCreator = () => {
    setCreatorVisible(false);
  }

  const handleAddClick = () => {
    setCreatorVisible(true);
  }

  const saveOnClick = (playlistLink, playlistType, source) => {

    console.log("Inside saveOnClick()");
    console.log(playlistLink);
    console.log(playlistType);
    if (source === TYPE_SPOTIFY) {
      if (playlistLink && playlistType && typeof (playlistLink) === 'string') {

        const urlArray = playlistLink.split(':');

        const spotifyID = urlArray[urlArray.length - 1];

        const parsedPlaylistObject = {
          id: spotifyID,
          playlistType: playlistType,
        }
        console.log(parsedPlaylistObject);
        console.log(accessToken);

        const parsedParam = {
          playlists: [parsedPlaylistObject],
          accessToken,
          authorID
        };

        dispatch(spotifyGetManyPlaylistsThunk(parsedParam))
          .then((res) => {
            console.log("res: ");
            console.log(res);
          });

      } else {
        console.log("invalid playlist link or type (SAVE PLAYLIST ERROR inside saveOnClick()");
      }
    } else if (source === TYPE_YOUTUBE) {
      dispatch(getYoutubePlaylistByIDAsync(playlistLink))
        .then((res) => {
          console.log("res: ");
          console.log(res.payload);
          // dispatch(createPlaylistAsync(res.payload));
        })
    } else {
      console.log(`Unexpected platform [${source}] for playlist`);
    }


    // make API call here...
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
        {spotifyTracks.map((song, i) => (
          <SongResult
            className='spotify-preview'
            songObject={song}
            key={song.link}
            thumbnailUrl={song.imageLink}
            songName={song.name}
            artistName={song.artist}
            views={song.views + ' streams'}
            duration={song.duration}
            songLink={song.link}
            source={TYPE_SPOTIFY}
            handleAddClick={handleAddClick}
            playlistCreatorRef={playlistCreatorRef}
            releaseDate={song.releaseDate}

            // new changes
            isFavorite={false}
          />
        ))}
      </div>

      <div className='spotify-albums'>
        <h2 className='heading'>Spotify Albums</h2>
        <div className='spotify-album-list' style={{ display: 'flex', flexWrap: 'wrap' }}>

          {spotifyAlbums.map((album, i) => (
            <PlaylistResult
              className={'spotify-album-preview'}
              key={album.originId}
              thumbnailUrl={album.coverImageURL}
              playlistName={album.name}
              artistName={album.author}
              views={album.popularity + ' views'}
              playlistLink={album.originId}
              releaseDate={album.dateCreated}

              // new changes
              isFavorite={false}
              duration={album.duration}
              source={TYPE_SPOTIFY}
              type={TYPE_ALBUM}
              optionType={OPTIONS_TYPE3}
              saveOnClick={saveOnClick}
              description={null}
            />
          ))}
        </div>
      </div>

      <div className='spotify-playlists'>
        <h2 className='heading'>Spotify Playlists</h2>
        <div className='spotify-playlist-list' style={{ display: 'flex', flexWrap: 'wrap' }}>
          {spotifyPlaylists.map((playlist, i) => (
            <PlaylistResult
              className={'spotify-playlist-preview'}
              key={playlist.originId}
              thumbnailUrl={playlist.coverImageURL}
              playlistName={playlist.name}
              artistName={playlist.author}
              views={0 + ' views'}
              playlistLink={playlist.originId}
              releaseDate={playlist.dateCreated}

              // new changes
              isFavorite={false}
              duration={playlist.duration}
              source={TYPE_SPOTIFY}
              type={TYPE_PLAYLIST}
              optionType={OPTIONS_TYPE3}
              saveOnClick={saveOnClick}
              description={playlist.description}
            />
          ))}
        </div>
      </div>

      <div className='youtube-videos'>
        <h2 className='heading'>Youtube Videos</h2>
        <div className='youtube-video-list' style={{ display: 'flex', flexWrap: 'wrap' }}>
          {youtubeVideos.map((song, i) => (
            <SongResult
              className={'youtube-preview'}
              key={song.link}
              songObject={song}
              thumbnailUrl={song.imageLink}
              songName={song.name}
              artistName={song.artist}
              views={song.views + ' views'}
              duration={song.duration}
              songLink={song.link}
              source={TYPE_YOUTUBE}

              // new changes
              isFavorite={false}
              releaseDate={song.dateCreated}
            />
          ))}

        </div>
      </div>

      <div className='youtube-playlists'>
        <h2 className='heading'>Youtube Playlists</h2>
        <div className='youtube-playlist-list' style={{ display: 'flex', flexWrap: 'wrap' }}>
          {youtubePlaylists.map((playlist, i) => (
            <PlaylistResult
              className={'youtube-playlist-preview'}
              key={i}
              thumbnailUrl={playlist.coverImageURL}
              playlistName={playlist.name}
              artistName={playlist.author}
              songs={[]}
              // views={song.views + ' views'}
              // duration={song.duration}
              playlistLink={playlist.originId}
              // releaseDate={playlist.releaseDate}

              // new changes
              isFavorite={false}
              // duration={playlist.duration}
              source={TYPE_YOUTUBE}
              type={TYPE_PLAYLIST}
              optionType={OPTIONS_TYPE3}
              saveOnClick={saveOnClick}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


export default SearchPage;
