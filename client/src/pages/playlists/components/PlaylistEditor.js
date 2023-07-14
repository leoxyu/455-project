import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import {createPlaylistAsync} from '../../../components/home/redux/thunks';
import '../../../styles/variables.css';
import '../styles/playlistEditor.css';

const SongDisplay = ({ name, artist, image }) => {
  return (
    <div className="song-info-container">
      <img src={image} alt="Cover Art" width="48px" height="48px"/>
      <div className="song-info">
        <div className="song-title">{name}</div>
        <div className="song-artist">{artist}</div>
      </div>
    </div>
  );
};

const PlaylistEditor = ({ playlist, onClose }) => {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [imageUrl, setImageUrl] = useState(playlist.coverImageURL);
  const [songs, setSongs] = useState(playlist.songs);

  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const submitPlaylist = () => {
    // const data = {
    //     name: playlistName,
    //     songs: [],
    //     description: playlistDescription,
    // }
    // dispatch(createPlaylistAsync(data));
    // setPlaylistName('');
    // onClose();
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
    <div className='modal-container'>
      <h2 className='playlist-editor-title'>Playlist Editor</h2>

      <div className=''>
        <input
          className='playlist-editor-input'
          type="text"
          value={name}
          onChange={handleNameChange}
          id="titleField"
          placeholder='Name'
        />

      </div>
      <div className=''>
        <textarea
          className='playlist-editor-input'
          value={description}
          onChange={handleDescriptionChange}
          id='descriptionField'
          onInput={handleInputResize}
          placeholder='Description'
        />
        <div className="songs-editor-container">
          {songs.map((song, i) => {
            return (
              <SongDisplay
                name={song.songName}
                artist={song.artistName}
                image={song.thumbnailUrl}
              />
            );
          })}
        </div>
      </div>
      <div className='playlist-creator-buttons'>
        <button className='creator-button' onClick={onClose}>Cancel</button>
        <button className='creator-button' onClick={submitPlaylist}>Update</button>
      </div>
    </div>
  );
};

export default PlaylistEditor;
