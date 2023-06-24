import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {addSongAsync} from '../../../components/home/redux/thunks';

const Options = ({ songLink, onClose, platform }) => {
  const playlists = useSelector((state) => state.playlists.playlists);
  const dispatch = useDispatch();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  const handlePlaylistChange = (event) => {
    setSelectedPlaylist(event.target.value);
  };

  const handleSelection = () => {
    // Handle playlist selection
    // console.log(`Selected playlist: ${selectedPlaylist}`);
    const data = {
        URI: songLink,
        source: platform
    }
    dispatch(addSongAsync(selectedPlaylist, data));
    onClose(); // Trigger the onClose callback
  };

  return (
    <div>
      <p style={{fontSize:'10px'}}>Add to playlist:</p>
      <select onChange={handlePlaylistChange}>
        {playlists.map((playlist) => (
          <option key={playlist.playlistID} value={playlist.playlistID}>
            {playlist.name}
          </option>
        ))}
      </select>
      <button onClick={handleSelection}>Add</button>
    </div>
  );
};

export default Options;
