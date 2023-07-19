
import React, { useState, useEffect } from 'react';
import '../../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import '../styles/Preview.css';
import '../styles/SpAlbumPreview.css';
import '../styles/SpPlaylistPreview.css';
import { useRef } from "react";
import '../styles/YtPlaylistPreview.css';
import {editPlaylistAsync} from '../../../components/home/redux/thunks';
import { setPlaylist } from '../../../components/player/PlayerReducer';
import Options2 from '../components/Options2';
import thumbnailImage from '../../../images/album-placeholder.png'

const { v4: uuid } = require('uuid');


const PlaylistResult = ({ className, thumbnailUrl, playlistName, date, duration, artistName, isFavorite, source, type, songs=[], playlistLink, deleteOnClick, editOnClick}) => {
  const [ioplaylistName, setPlaylistName] = useState(playlistName);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsTop, setOptionsTop] = useState(false);
  const [optionsLeft, setOptionsLeft] = useState(false);

  const dispatch = useDispatch();

  let optionsPopupRef = useRef();

  useEffect(() => {
    let optionsHandler = (e) => {
      if (!optionsPopupRef.current.contains(e.target)) {
        setOptionsOpen(false);
      }
    }

    document.addEventListener("mousedown", optionsHandler);

    return () => {
      document.removeEventListener("mousedown", optionsHandler);
    }
  });

  const optionsOnClick = (top, left) => {
    if (optionsOpen) {
      setOptionsOpen(false);
    } else {
      setOptionsTop(top + 21);
      setOptionsLeft(left - 45);
      setOptionsOpen(true);
    }
  };

  const handleInputChange = (event) => {
    setPlaylistName(event.target.value);
  };

  let optionsRef = null;

  const handlePlay = () => {
    // example of how youc an load a playlist in the player. this is a temporary playlist and when we finish the api stuff we'll be using the data from songs instead

    dispatch(setPlaylist({
      id: uuid(),

      playlistName: playlistName,
      coverUrl: thumbnailUrl,
      releaseDate: date,
      duration: duration,
      artists: artistName,
      isFavorite: isFavorite,
      source: source,
      type: type,

      songs: songs
    }));
  };

  const handleDelete = () => {
    setOptionsOpen(false);
    deleteOnClick();
  };

  const handleEdit = () => {
    setOptionsOpen(false);
    editOnClick();
  };

  const handleFavorite = () => {
    // Handle favorite button click
  };

  const handleOptions = () => {
    // Handle options button click
    const optionsLocation = optionsRef.getBoundingClientRect();
    optionsOnClick(optionsLocation.top, optionsLocation.left);
  };

  //  TODO avoid rendering if we use none in css

  return (
    <div>
    <div className={className}>
        <div className='essential-info'>
            <div className="thumbnail-container">
                <img className="thumbnail" src={thumbnailUrl ? thumbnailUrl : thumbnailImage} alt="Album Thumbnail" />
                <PlayIcon className="play-icon" onClick={handlePlay}/>
            </div>
            <div className="details">
                <div className="name">{playlistName}</div>
                <div className="secondary-details">
                <div className="date">{date}</div>
                <div className="artist-name">{artistName}</div>
                </div>
                <div className="optional-details">
                {songs.slice(0,3).map((song) => (
                <div className="song">{song.songName}</div>
                ))}
                </div>
            </div>
        </div>
        <div className="stats">
            <HeartIcon className="heart-icon" onClick={handleFavorite}/>
            <div className="duration">{duration}</div>
            <div ref={optionsPopupRef}>
              <OptionsIcon className="options-icon" onClick={handleOptions} ref={el => optionsRef = el}/>
              <Options2 open={optionsOpen} top={optionsTop} left={optionsLeft} deleteOnClick={handleDelete} editOnClick={handleEdit}/>
            </div>
        </div>
      </div>
        </div>
  );
};

export default PlaylistResult;
