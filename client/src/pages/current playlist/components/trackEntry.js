import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
// import { ReactComponent as PlayingIcon } from "../../../images/playingWave.gif";

import PlayingIcon from "../../../images/playingWave.gif";
import "../styles/playlistTrack.css";

import {setCurrSongID} from "../../../components/player/PlayerReducer.js";
import { setCurrSongIdPlaylistPage } from '../redux/currentPlaylistReducer';
import Options from '../../search/components/Options';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../../../typeConstants.js");


const TrackEntry = ({ songID, name, artist, duration, album, isFavorited, link, imageLink, releaseDate, source, index }) => {

  const dispatch = useDispatch();
  const currSongID = useSelector(state => state.currentPlaylistPage.currSongID);
  const trackDuration = convertMsToDuration(duration);

  function convertMsToDuration(duration) {
    if (typeof (duration) === 'number') {
      return new Date(duration).toISOString().slice(11, 19);
    } else return duration;
  }

  useEffect(() => {
    if (currSongID && currSongID.songID === songID) {
      // highlight the current track object
    }
  }, [currSongID]);

  const isCurrentlyPlaying = currSongID === songID;

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

  const handlePlay = () => {
    // Handle play button click
    dispatch(setCurrSongID(songID));
    dispatch(setCurrSongIdPlaylistPage(songID));
  };

  return (
    <div className="track-container">
      <div className="track-container-left">
        <p className={"track-id-" + (isCurrentlyPlaying ? 'active' : 'inactive')}>{index + 1}</p>
        {isCurrentlyPlaying ? <img className="playing-icon" src={PlayingIcon}/>
          : <PlayIcon className="play-icon" onClick={handlePlay} />}
        <img className='track-cover' src={imageLink} alt="Track Cover" />
        <p className={"name-" + (isCurrentlyPlaying ? 'active' : 'inactive')}>{name}</p>
      </div>
      <div className="track-container-right">
        <p className="track-duration">{trackDuration}</p>
        <OptionsIcon className="options-icon" onClick={handleOptions} ref={el => optionsRef = el} />
      </div>
      <div ref={optionsPopupRef}>
        {/* <Options
          open={optionsOpen}
          top={optionsTop}
          left={optionsLeft}
          songBody={songObject}
          onClose={() => setOptionsOpen(false)}
          handleAddClick={handleAddClick}
        /> */}
      </div>
    </div>
  );
}

export default TrackEntry;