import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import PlayingIcon from "../../../images/playingWave.gif";
import "../../../styles/variables.css"
import "../styles/playlistTrack.css";

import { setCurrSongID, setPlaylist } from "../../../components/player/PlayerReducer.js";
import { setCurrSongIdPlaylistPage } from '../redux/currentPlaylistReducer';
import Options from '../../search/components/Options';

const TrackEntry = ({ parentPlaylist, songObject, handleAddClick, songID, name,  duration,  imageLink,  index }) => {
  const dispatch = useDispatch();
  const currSongID = useSelector(state => state.currentPlaylistPage.currSongID);
  const currPlayingPlaylistID = useSelector(state => state.player.playlist.id);
  const trackDuration = convertMsToDuration(duration);
  const [inPlaylistTransition, setInPlaylistTransition] = useState(false);

  function convertMsToDuration(duration) {
    if (typeof (duration) === 'number') {
      return new Date(duration).toISOString().slice(11, 19);
    } else return duration;
  }

  const [optionsOpen, setOptionsOpen] = useState(false);

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

  const handleOptions = () => {
    setOptionsOpen(!optionsOpen);
  };

  useEffect(() => {
    if (inPlaylistTransition) {
      console.log(`song id after is ${songID}`)
      dispatch(setCurrSongID(songID));
      dispatch(setCurrSongIdPlaylistPage(songID));
      setInPlaylistTransition(false);
    }
  }, [currPlayingPlaylistID]);

  const handlePlay = () => {
    if (currPlayingPlaylistID !== parentPlaylist.id) {
      console.log(`song id before is ${songID}`)
      setInPlaylistTransition(true);
      dispatch(setPlaylist({ playlist: parentPlaylist, startFromTop: false }));
    }

    dispatch(setCurrSongID(songID));
    dispatch(setCurrSongIdPlaylistPage(songID));
  };

  const isCurrentlyPlaying = currSongID === songID;

  return (
    <div className="track-container">
      <div className="track-container-left">
        <p className={"track-id-" + (isCurrentlyPlaying ? 'active' : 'inactive')}>{index + 1}</p>
        { isCurrentlyPlaying ? <img className="playing-icon" src={PlayingIcon} alt=""/>
          : <PlayIcon className="play-icon" onClick={handlePlay} />}
        <img className='track-cover' src={imageLink} alt="Track Cover" />
        <p className={"name-" + (isCurrentlyPlaying ? 'active' : 'inactive')}>{name}</p>
      </div>
      <div className="track-stats">
        <p className="track-duration">{trackDuration}</p>
        <div ref={optionsPopupRef}>
          <OptionsIcon className="track-options-icon" onClick={handleOptions} />
          <div className='track-options' ref={optionsPopupRef}>
            <Options
              open={optionsOpen}
              songBody={songObject}
              onClose={() => setOptionsOpen(false)}
              handleAddClick={handleAddClick}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default TrackEntry;
