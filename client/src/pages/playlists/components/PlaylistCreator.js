import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {createPlaylistAsync} from '../../../components/home/redux/thunks';
import '../../../styles/variables.css';
import '../styles/playlistCreator.css'

import {TYPE_UNIFI, TYPE_PLAYLIST } from '../../../typeConstants';

const PlaylistCreator = ({onClose=()=>{}}) => {
  const [playlistName, setPlaylistName] = useState('');
  const [playlistDescription, setPlaylistDescription] = useState('');
  const author = useSelector((state) => state.login.authorID);

  const user = useSelector((state) => state.login.id);

  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setPlaylistName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setPlaylistDescription(event.target.value);
  };

  const createPlaylist = () => {
    const data = {
        name: playlistName,
        songs: [],
        description: playlistDescription,
        author: author,
        artist: user,
        isAlbum: false,
        type: TYPE_PLAYLIST,
        source: TYPE_UNIFI,
        duration: 0,
    }
    dispatch(createPlaylistAsync(data));
    setPlaylistName('');
    onClose();
    //  redirect to the playlist view page
  };

  const calculateTextareaHeight = (element) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleInputResize = (event) => {
    const textarea = event.target;
    calculateTextareaHeight(textarea);
  };

  return (
    <div className='playlist-creator'>
      <h2 className='playlist-creator-title'>Create New Playlist</h2>

      <div className='playlist-creator-body'>
        <div className='playlist-creator-input-container'>
          <label htmlFor="titleField"
          className={`placeholder ${playlistName !== '' ? 'active' : ''}`}>
            Title
          </label>
          <input
            className='playlist-creator-input'
            type="text"
            value={playlistName}
            onChange={handleNameChange}
            id="titleField"
          />
        </div>
        <div className='playlist-creator-input-container'>
          <label htmlFor="descriptionField"
          className={`placeholder ${playlistDescription !== '' ? 'active' : ''}`}>
          Description
          </label>
          <textarea
            className='playlist-creator-input description'
            value={playlistDescription}
            onChange={handleDescriptionChange}
            id='descriptionField'
            onInput={handleInputResize}
          />
        </div>
        <div className='playlist-creator-buttons'>
          <button className='creator-button' onClick={onClose}>Cancel</button>
          <button className='creator-button' onClick={createPlaylist}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistCreator;
