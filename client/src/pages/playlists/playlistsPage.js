import React, { useState, useEffect} from 'react';
import '../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import {getPlaylistsAsync, deletePlaylistAsync} from '../../components/home/redux/thunks';
import '../../styles/PlaylistsPage.css';
import SearchBar from '../search/components/SearchBar';
import PlaylistResult from '../search/components/PlaylistResult';
import Filters from '../search/components/Filters';
import PlaylistCreator from '../search/components/PlaylistCreator';


//  look here later: https://github.com/dermasmid/scrapetube
// also here: https://github.com/paulomcnally/youtube-node
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
            key={playlist.playlistID}
            thumbnailUrl={playlist.coverImageURL}
            playlistName={playlist.name}
            artistName={playlist.author}
            songs={playlist.songs}
            // views={song.views + ' views'}
            // duration={song.duration}
            optionsOnClick={() => optionsOnClick(playlist.playlistID)}
          />
        ))}
          </div> 
    </div>
  );
};



export default PlaylistPage;
