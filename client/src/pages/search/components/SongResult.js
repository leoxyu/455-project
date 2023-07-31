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

const SongResult = ({ className, isFavorite, songObject }) => {

  const dispatch = useDispatch();

  const handlePlay = () => {

    dispatch(setPlaylist({
      id: uuid(), // this id doesn't actually need to be the actual song id since it's just used for recognizing when a song changes in the player
      songs: [songObject]
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
          <img className="thumbnail" src={songObject.imageLink ? songObject.imageLink : thumbnailImage} alt="Album Thumbnail" />

          <PlayIcon className="play-icon" onClick={handlePlay} />
        </div>
        <div className="details">
          <div className="name">{songObject.name}</div>
          <div className="artist">{songObject.artist}</div>
          <div className="artist-name">{songObject.artist}</div>
        </div>
      </div>
       <div className="stats">
          <HeartIcon className="heart-icon" onClick={handleFavorite}/>
          <div className="duration">{songObject.duration}</div>
          <div ref={optionsPopupRef}>
            <OptionsIcon className="options-icon" onClick={handleOptions} ref={el => optionsRef = el}/>
            <Options
              open={optionsOpen}
              top={optionsTop}
              left={optionsLeft}
              songBody={songObject}
              onClose={() => setOptionsOpen(false)}
            />
          </div>
      </div>
    </div>
  );
};

export default SongResult;
