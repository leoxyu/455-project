import React, { useState, useEffect} from 'react';
import '../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import {getPlaylistsAsync, deletePlaylistAsync} from '../../components/home/redux/thunks';
import '../../styles/PlaylistsPage.css';
import SearchBar from '../search/components/SearchBar';
import PlaylistResult from '../search/components/PlaylistResult';
import Filters from '../search/components/Filters';
import PlaylistCreator from './components/PlaylistCreator';

const PlaylistPage = () => {

  useEffect(() => {
    document.title = "Uni.fi - Playlists"; // Change the webpage title

    // Clean up the effect
    
  }, []);

  const playlists = useSelector(state => state.playlists.playlists);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPlaylistsAsync());
  }, []);


  const handleSearch = async () => {

    //  do something
  };

  const optionsOnClick = (playlistID) => {
    dispatch(deletePlaylistAsync(playlistID));
  };



  return (
    <div className='playlists-page'>
      
      <SearchBar />
      <Filters />
       <PlaylistCreator />
        <h2 className='heading'>Your Playlists</h2>
        <div className='unifi-playlists-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
        {playlists.map((playlist) => (
          <PlaylistResult
            className={'spotify-playlist-preview'}
            playlistID={playlist.playlistID}
            thumbnailUrl={playlist.coverImageURL}
            playlistName={playlist.name}
            artistName={playlist.author}
            songs={playlist.songs}
            optionsOnClick={() => optionsOnClick(playlist.playlistID)}
            isEditable={true}
          />
        ))}
          </div> 
    </div>
  );
};



export default PlaylistPage;
