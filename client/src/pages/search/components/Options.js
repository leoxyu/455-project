import React, { useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {addSongAsync, getPlaylistsAsync} from '../../../components/home/redux/thunks';
import '../../../styles/variables.css';
import '../styles/Options.css';
import SearchBar from './SearchBar';

const Options = ({ open, top, left, songBody = {}, onClose=()=>{}, handleAddClick=()=>{}}) => {
  const playlists = useSelector((state) => state.playlists.playlists);
  const dispatch = useDispatch();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  useEffect(() => {
    dispatch(getPlaylistsAsync());
  }, []);

  const handlePlaylistChange = (event) => {
    setSelectedPlaylist(event.target.value);
    // setSelectedPlaylist('wtf');
  };


  const handleSelection = (playlistID, event) => {
    // Handle playlist selection
    // console.log(`Selected playlist: ${selectedPlaylist}`);
    // const data = {
    //     URI: songLink,
    //     source: platform
    // };

    dispatch(addSongAsync({ playlistID, songBody }));
    onClose(); // Trigger the onClose callback
  };

  return (
    <div className={`search-options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
      <p className='options-title'>Add to playlist:</p>
      <SearchBar />
        <div className="options-playlist-input" onClick={handleAddClick}>
          New playlist
        </div>
      <div className="options-dropdown">
        {/* add search bar here*/}
        {playlists.map((playlist, i) => (
          <div
            key={i}
            className="options-playlist-input"
            value={playlist.playlistID}
            onClick={(e) => handleSelection(playlist.playlistID, e)}>
            {playlist.name}
          </div>
        ))}
      </div>
      {/* <button onClick={handleSelection}>Add</button> */}
    </div>
  );
};

export default Options;
