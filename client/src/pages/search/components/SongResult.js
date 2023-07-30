import React, { useEffect, useRef, useState } from 'react';
import Options from './Options';
import '../../../styles/variables.css';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import '../styles/Preview.css'
import '../styles/YtVideoPreview.css';
import '../styles/SpSongPreview.css';
import thumbnailImage from '../../../images/album-placeholder.png'
import { useDispatch } from 'react-redux';
import { setPlaylist } from '../../../components/player/PlayerReducer';

import { TYPE_TRACK } from '../../../typeConstants';

const { v4: uuid } = require('uuid');

const SongResult = ({ className, thumbnailUrl, songName, artistName, views, duration, songLink, platform, songID, releaseDate, album, isFavorite, handleAddClick = () => { }, songObject }) => {

  const dispatch = useDispatch();

  const handlePlay = () => {

    dispatch(setPlaylist({
      id: uuid(), // this id doesn't actually need to be the actual song id since it's just used for recognizing when a song changes in the player
      songs: [{
        name: songName,
        artist: artistName,
        type: platform,
        link: songLink,
        imageLink: thumbnailUrl
      }]
    }));
    // Handle play button click
  };

  const handleFavorite = () => {
    // Handle favorite button click
  };

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsTop, setOptionsTop] = useState(false);
  const [optionsLeft, setOptionsLeft] = useState(false);

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
      setOptionsLeft(left - 85);
      setOptionsOpen(true);
    }
  };

  let optionsRef = null;

  const handleOptions = () => {
    // Handle options button click
    const optionsLocation = optionsRef.getBoundingClientRect();
    optionsOnClick(optionsLocation.top, optionsLocation.left);
  };


  return (
    <div className={className}>
      <div className='essential-info'>
        <div className="thumbnail-container">
          <img className="thumbnail" src={thumbnailUrl ? thumbnailUrl : thumbnailImage} alt="Album Thumbnail" />

          <PlayIcon className="play-icon" onClick={handlePlay} />
        </div>
        <div className="details">
          <div className="name">{songName}</div>
          <div className="artist">{artistName}</div>
          <div className="artist-name">{artistName}</div>
        </div>
      </div>
       <div className="stats">
          <HeartIcon className="heart-icon" onClick={handleFavorite}/>
          <div className="duration">{duration}</div>
          <div ref={optionsPopupRef}>
            <OptionsIcon className="options-icon" onClick={handleOptions} ref={el => optionsRef = el}/>
            <Options
              open={optionsOpen}
              top={optionsTop}
              left={optionsLeft}
              songBody={{
                name: songName,
                artist: artistName,
                type: platform,
                link: songLink,
                imageLink: thumbnailUrl ? thumbnailUrl : thumbnailImage,
                duration: duration,
                songID: songID,
                releaseDate: releaseDate,
                album: album
              }}
              onClose={() => setOptionsOpen(false)}
            />
          </div>
      </div>
    </div>
  );
};

export default SongResult;
