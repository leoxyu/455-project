import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { editPlaylistAsync } from '../../../components/home/redux/thunks';
import { AiOutlineCloseCircle } from 'react-icons/ai';
import thumbnailImage from '../../../images/album-placeholder.png'
import '../../../styles/variables.css';
import '../styles/playlistEditor.css';

const SongDisplay = ({ name, artist, image, onDelete }) => {
  return (
    <div className="song-display-container">
      <div className="song-info-container">
        <img src={image} alt="" width="48px" height="48px" />
        <div className="song-info">
          <div className="song-title">{name}</div>
          <div className="song-artist">{artist}</div>
        </div>
      </div>
      <div className="song-delete-container">
        <AiOutlineCloseCircle size="24px" className="song-delete-button" onClick={onDelete} />
      </div>
    </div>
  );
};

const PlaylistEditor = ({ playlist, onClose }) => {
  const [name, setName] = useState(playlist.name);
  const [description, setDescription] = useState(playlist.description);
  const [imageUrl, setImageUrl] = useState(playlist.coverImageURL);
  const [deletedSongs, setDeletedSongs] = useState([]);

  const dispatch = useDispatch();

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleUrlChange = (event) => {
    setImageUrl(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const submitPlaylist = () => {
    if (!(name.trim())) {
      return;
    }

    const newSongs = [];

    for (const [i, song] of playlist.songs.entries()) {
      if (!deletedSongs.includes(i)) {
        const songClone = { ...song };
        newSongs.push(songClone);
      }
    }

    const playlistEdit = {
      playlistID: playlist.playlistID,
      name: name,
      description: description,
      coverImageURL: imageUrl,
      songs: newSongs
    };

    dispatch(editPlaylistAsync(playlistEdit));
    onClose();
  };

  const calculateTextareaHeight = (element) => {
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  };

  const handleInputResize = (event) => {
    const textarea = event.target;
    calculateTextareaHeight(textarea);
  };

  const deleteSong = (index) => {
    const newDeletedSongs = [...deletedSongs];
    newDeletedSongs.push(index);
    setDeletedSongs(newDeletedSongs);
  };

  return (
    <div className='modal-container'>
      <h2 className='playlist-editor-title'>Playlist Editor</h2>
      <div className='playlist-editor-title-container'>
        <div className="playlist-editor-image-container">
          <img src={imageUrl ? imageUrl : thumbnailImage} className="playlist-editor-image" alt="" />
        </div>
        <div className='playlist-editor-title-container-input'>
          <input
            className='playlist-editor-input-name'
            type="text"
            value={name}
            onChange={handleNameChange}
            id="titleField"
            placeholder='Name'
          />
          <input
            className='playlist-editor-input'
            value={description}
            onChange={handleDescriptionChange}
            id='descriptionField'
            onInput={handleInputResize}
            placeholder='Description'
          />
          <input
            className='playlist-editor-input'
            type="text"
            value={imageUrl}
            onChange={handleUrlChange}
            id="titleField"
            placeholder='Cover Image Link'
          />
        </div>
      </div>
      <div>
        <div className="songs-editor-container">
          {playlist.songs.map((song, i) => {
            return (
              <div key={i}>
                {!deletedSongs.includes(i) && <SongDisplay
                  name={song.name}
                  artist={song.artist}
                  image={song.imageLink}
                  onDelete={() => deleteSong(i)}
                />}
              </div>
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
