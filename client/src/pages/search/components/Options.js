import React, { useState, useEffect, useRef} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {addSongAsync, getPlaylistsAsync} from '../../../components/home/redux/thunks';
import '../../../styles/variables.css';
import '../styles/Options.css';

const Options = ({ open, top, left, songBody, onClose, handleAddClick=()=>{}}) => {
  const playlists = useSelector((state) => state.playlists.playlists);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPlaylistsAsync());
  }, []);

  const handleSelection = (playlistID) => {
    dispatch(addSongAsync({ playlistID, songBody }));
    onClose(); // Trigger the onClose callback
  };

  return (
    <div className={`search-options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
      <p className='options-title'>Add to playlist:</p>
        {/* <div className="options-playlist-input" onClick={handleAddClick}>
          New playlist
        </div> */}
      <div className="options-dropdown">
        {playlists.map((playlist, i) => (
          <div
            key={i}
            className="options-playlist-input"
            value={playlist.playlistID}
            onClick={() => handleSelection(playlist.playlistID)}>
            {playlist.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Options;
