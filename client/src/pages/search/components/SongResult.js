import React, { useEffect, useRef, useState } from 'react';
import Options from './Options';
import '../../../styles/variables.css';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import { ReactComponent as SpotifyIcon } from '../../../images/spotify.svg';
import { ReactComponent as YoutubeIcon } from '../../../images/youtube.svg';
import { ReactComponent as UnifiIcon } from '../../../images/unifilogo.svg';
import PlayingIcon from "../../../images/playingWave.gif";
import { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_UNIFI } from '../../../typeConstants';
import '../styles/Preview.css'
import '../styles/YtVideoPreview.css';
import '../styles/SpSongPreview.css';
import { setPlaylist } from '../../../components/player/PlayerReducer';
import { useSelector, useDispatch } from 'react-redux';
import { TYPE_TRACK } from '../../../typeConstants';

const { v4: uuid } = require('uuid');

const SongResult = ({ className,  isFavorited, handleAddClick = () => { }, songObject }) => {
  const currSongID = useSelector(state => state.currentPlaylistPage.currSongID);

  const dispatch = useDispatch();

  const handlePlay = () => {
    dispatch(setPlaylist({
      playlist: {
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
      },
      startFromTop: true,
    }));
  };

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

  const isCurrentlyPlaying = currSongID === songObject.songID;

  return (
    <div className={className}>

      <div className='essential-info'>
        <div className="thumbnail-container">
          <img className="thumbnail" src={songObject.imageLink} alt="Track Thumbnail" />
          { isCurrentlyPlaying ?
          <img className="playing-icon" src={PlayingIcon} alt=""/>
          :
          <PlayIcon className="play-icon" onClick={handlePlay} />}
        </div>
        <div className="details">
          <div className={"name-"+ ((isCurrentlyPlaying)? "active":"inactive")}>{songObject.name}</div>
          <div className="artist">{songObject.artist}</div>
        </div>
      </div>
      <div className="stats">
        {/* {sourceIcon(songObject.source)} */}
        <div className="duration">{songObject.duration}</div>
        <div ref={optionsPopupRef}>
          <OptionsIcon className="options-icon" onClick={handleOptions} />
          <div className='options' ref={optionsPopupRef}>
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
};

export default SongResult;
