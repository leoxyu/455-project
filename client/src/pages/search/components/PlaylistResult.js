
import React, { useState, useEffect } from 'react';
import '../../../styles/variables.css';
import { useDispatch } from 'react-redux';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import { ReactComponent as SpotifyIcon } from '../../../images/spotify.svg';
import { ReactComponent as YoutubeIcon } from '../../../images/youtube.svg';
import { ReactComponent as UnifiIcon } from '../../../images/unifilogo.svg';
import '../styles/Preview.css';
import '../styles/SpPlaylistPreview.css';
import { useRef } from "react";
import '../styles/YtPlaylistPreview.css';
import { editPlaylistAsync, getOnePlaylist } from '../../../components/home/redux/thunks';
import { setPlaylist } from '../../../components/player/PlayerReducer';
import Options2 from './Options2';
import Options3 from './Options3';
import thumbnailImage from '../../../images/album-placeholder.png'
import { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_UNIFI } from '../../../typeConstants';


import { OPTIONS_TYPE2, OPTIONS_TYPE3 } from '../../../typeConstants';

const PlaylistResult = ({className, songs = [], deleteOnClick, editOnClick, saveOnClick, optionType, playlistObject }) => {

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsTop, setOptionsTop] = useState(false);
  const [optionsLeft, setOptionsLeft] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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

  // upon songs loading, dispatch to player
  useEffect(() => {
    if (isLoading && songs.length) {
      setIsLoading(false);
      dispatch(setPlaylist({
        id: (playlistObject.playlistID)? playlistObject.playlistID: playlistObject.originId,
        playlistName: playlistObject.name,
        thumbnailUrl: playlistObject.coverImageURL,
        releaseDate: playlistObject.dateCreated, //
        duration: songs.length,
        artistName: playlistObject.author,
        isFavorited: playlistObject.isFavorited,
        source: playlistObject.source,
        description: playlistObject.description,
        type: playlistObject.type,
        songs: songs
      }));
    }
  }, [songs]); // dep array only needs songs

  const optionsOnClick = (top, left) => {
    if (optionsOpen) {
      setOptionsOpen(false);
    } else {
      setOptionsTop(top + 21);
      setOptionsLeft(left - 45);
      setOptionsOpen(true);
    }
  };



  let optionsRef = null;

  const handlePlay = async () => {
    // hit play for first time, load songs
    if (!songs?.length) {
      setIsLoading(true);
      dispatch(getOnePlaylist((playlistObject.playlistID)? playlistObject.playlistID: playlistObject.originId));
    }
    // if songs already loaded, dispatch to player
    dispatch(setPlaylist({
      id: (playlistObject.playlistID)? playlistObject.playlistID: playlistObject.originId,
      playlistName: playlistObject.name,
      thumbnailUrl: playlistObject.coverImageURL,
      releaseDate: playlistObject.dateCreated, //
      duration: songs.length,
      artistName: playlistObject.author,
      isFavorited: playlistObject.isFavorited,
      source: playlistObject.source,
      description: playlistObject.description,
      type: playlistObject.type,
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

  const handleSetFavorite = () => {
    setOptionsOpen(false);
    const playlistEdit = {
      playlistID: playlistObject.playlistID,
      isFavorited: !playlistObject.isFavorited
    };

    dispatch(editPlaylistAsync(playlistEdit));
  };

  const handleOptions = () => {
    // Handle options button click
    const optionsLocation = optionsRef.getBoundingClientRect();
    optionsOnClick(optionsLocation.top, optionsLocation.left);
  };

  //  TODO avoid rendering if we use none in css

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
    <div>
      <div className={className}>
        <div className='essential-info'>
          <div className="thumbnail-container">
            <img className="thumbnail" src={playlistObject.coverImageURL?  playlistObject.coverImageURL: thumbnailImage} alt="Album Thumbnail" />
            <PlayIcon className="play-icon" onClick={handlePlay} />
          </div>
          <div className="details">
            <div className="name">{playlistObject.name}</div>
            <div className="artist">{playlistObject.author}</div>
          </div>
        </div>
        <div className="stats">
          <div ref={optionsPopupRef}>
            <OptionsIcon className="options-icon" onClick={handleOptions} ref={el => optionsRef = el} />
            {optionType === OPTIONS_TYPE2 && <Options2 open={optionsOpen} top={optionsTop} left={optionsLeft} deleteOnClick={handleDelete} editOnClick={handleEdit} isFavorited={playlistObject.isFavorited} handleSetFavorite={handleSetFavorite}/>}
            {optionType === OPTIONS_TYPE3 && <Options3 open={optionsOpen} top={optionsTop} left={optionsLeft} playlistLink={(playlistObject.playlistID)? playlistObject.playlistID: playlistObject.originId} playlistType={playlistObject.type} source={playlistObject.source} saveOnClick={saveOnClick} />}
          </div>
        </div>
        {/* {sourceIcon(playlistObject.source)} */}
      </div>
    </div>
  );
};

export default PlaylistResult;
