import React, { useEffect, useRef, useState } from 'react';
import Options from './Options';
import '../../../styles/variables.css';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import { ReactComponent as SpotifyIcon } from '../../../images/spotify.svg';
import { ReactComponent as YoutubeIcon } from '../../../images/youtube.svg';
import { ReactComponent as UnifiIcon } from '../../../images/unifilogo.svg';
import { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_UNIFI } from '../../../typeConstants';
import '../styles/Preview.css'
import '../styles/YtVideoPreview.css';
import '../styles/SpSongPreview.css';
import { useDispatch } from 'react-redux';
import { setPlaylist } from '../../../components/player/PlayerReducer';

import { TYPE_TRACK } from '../../../typeConstants';

const { v4: uuid } = require('uuid');

const SongResult = ({ className,  isFavorited, handleAddClick = () => { }, songObject }) => {

  const dispatch = useDispatch();

  const handlePlay = () => {

    dispatch(setPlaylist({
      id: uuid(),
      playlistName: songObject.name,
      thumbnailUrl: songObject.imageLink,
      releaseDate: songObject.releaseDate,
      duration: songObject.duration,
      artistName: songObject.artist,
      isFavorited: isFavorited,
      source: songObject.source,
      description: null,
      type: TYPE_TRACK,
      songs: [songObject]
    }));
    // Handle play button click
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

  function sourceIcon(source) {
    if (source === TYPE_SPOTIFY) {
      return <SpotifyIcon className="source-icon" />;
    }
    if (source === TYPE_YOUTUBE) {
      return <YoutubeIcon className="source-icon"/>;
    }
    if (source === TYPE_UNIFI) {
      return <UnifiIcon className="source-icon" />;
    }
  };

  return (
    <div className={className}>

      <div className='essential-info'>
        <div className="thumbnail-container">
          <img className="thumbnail" src={songObject.imageLink} alt="Track Thumbnail" />
          <PlayIcon className="play-icon" onClick={handlePlay} />
        </div>
        <div className="details">
          <div className="name">{songObject.name}</div>
          <div className="artist">{songObject.artist}</div>
        </div>
      </div>
       <div className="stats">
          {/* {sourceIcon(songObject.source)} */}
          <div className="duration">{songObject.duration}</div>
          <div ref={optionsPopupRef}>
            <OptionsIcon className="options-icon" onClick={handleOptions} ref={el => optionsRef = el}/>
          </div>

      </div>
      <div ref={optionsPopupRef}>
        <Options
          open={optionsOpen}
          top={optionsTop}
          left={optionsLeft}
          songBody={songObject}
          onClose={() => setOptionsOpen(false)}
          handleAddClick={handleAddClick}
        />
      </div>
    </div>
  );
};

export default SongResult;
