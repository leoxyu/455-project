import React, { useEffect, useState } from 'react';
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
const { v4: uuid } = require('uuid');

const SongResult = ({ className, thumbnailUrl, songName, artistName, artists, duration, songLink, platform, handleAddClick = () => { }, songObject }) => {

  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [showIcons, setShowIcons] = useState(true);
  const [parsedSongObject, setparsedSongObject] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    if (songObject) {
      const parsed = {
        name: songObject.name,
        artist: songObject.artist,
        type: songObject.type,
        link: songObject.link,
        imageLink: songObject.imageLink,
      };
      setparsedSongObject(parsed);
    }
  }, [songObject]);

  const handlePlay = () => {
    // TODO: look to change search schema so this doesn't need to happen
    // let parsedSongObject;
    // if (songObject.songName) {
    //   // const url = songObject.songLink;
    //   // const id = url.substring(url.lastIndexOf("/") + 1);
    //   const artistName = songObject.artists[0];
    //   parsedSongObject = {
    //     songID: uuid(), // we need song id? can we just use the link
    //     name: songObject.songName,
    //     artist: artistName,
    //     type: 'spotify',
    //     link: songObject.songLink,
    //     imageLink: songObject.thumbnailUrl
    //   }
    // }

    dispatch(setPlaylist({
      id: uuid(),
      songs: [parsedSongObject ? parsedSongObject : songObject]
    }));
    // Handle play button click
  };

  const handleFavorite = () => {
    // Handle favorite button click
  };

  const handleOptions = () => {
    setShowOptionsDialog(true);
    setShowIcons(false);
  };

  const closeOptionsDialog = () => {
    setShowOptionsDialog(false);
    setShowIcons(true);
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
      {showIcons && (
        <div className="stats">
          <HeartIcon className="heart-icon" onClick={handleFavorite} />
          <div className="duration">{duration}</div>
          <OptionsIcon className="options-icon" onClick={handleOptions} />
        </div>
      )}

      {showOptionsDialog && (
        <Options songBody={parsedSongObject} onClose={closeOptionsDialog} handleAddClick={handleAddClick} />
      )}
    </div>
  );
};

export default SongResult;
