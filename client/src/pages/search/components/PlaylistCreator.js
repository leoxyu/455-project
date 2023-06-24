import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {createPlaylistAsync} from '../../../components/home/redux/thunks';

const PlaylistCreator = () => {
  const [playlistName, setPlaylistName] = useState('');
  const author = useSelector((state) => state.login.id);

  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setPlaylistName(event.target.value);
  };

  const createPlaylist = () => {
    // Replace this with your logic to create a new playlist
    // console.log(`Creating playlist: ${playlistName}`);
    const data = {
        name: playlistName,
        songs: [],
        author: author
    }
    dispatch(createPlaylistAsync(data));
    setPlaylistName('');
  };

  return (
    <div>
      <input
        type="text"
        value={playlistName}
        onChange={handleInputChange}
        placeholder="Enter a new playlist name"
      />
      <button onClick={createPlaylist}>+</button>
    </div>
  );
};

export default PlaylistCreator;
