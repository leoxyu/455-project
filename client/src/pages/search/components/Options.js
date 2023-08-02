import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {addSongAsync} from '../../../components/home/redux/thunks';
import '../../../styles/variables.css';
import '../styles/Options.css';

const Options = ({ open, top, left, songBody, onClose, handleAddClick=()=>{}}) => {
  const playlists = useSelector((state) => state.playlists.playlists);
  const dispatch = useDispatch();

  const handleSelection = (playlistID) => {
    dispatch(addSongAsync({ playlistID, songBody }));
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
