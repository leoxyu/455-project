import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSongAsync, getPlaylistsAsync } from '../../../components/home/redux/thunks';
import '../../../styles/variables.css';
import '../styles/Options.css';

import { lazyLoadAddSong } from '../../../components/player/PlayerReducer';
import { addSong } from '../../current playlist/redux/currentPlaylistReducer';

const Options = ({ open, top, left, songBody, onClose, handleAddClick = () => { } }) => {
  const playlists = useSelector((state) => state.playlists.playlists);
  const playerPlaylistID = useSelector((state) => state.player.playlist.id);
  const dispatch = useDispatch();

  const handleSelection = (playlistID) => {
    dispatch(addSongAsync({ playlistID, songBody }));
    if (playerPlaylistID === playlistID) {
      dispatch(lazyLoadAddSong([songBody]));
      dispatch(addSong(songBody));
    }
    onClose(); // Trigger the onClose callback
  };

  return (
    <div className={`search-options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
      <p className='options-title'>Add to playlist:</p>
      {(handleAddClick) ? <div className="options-playlist-input" onClick={handleAddClick}>
        New playlist
      </div> : null}
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
