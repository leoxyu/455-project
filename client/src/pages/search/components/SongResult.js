import React, { useState } from 'react';
import Options from './Options';
import '../../../styles/variables.css';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import '../styles/Preview.css'
import '../styles/YtVideoPreview.css';
import '../styles/SpSongPreview.css';


const SongResult = ({ className, thumbnailUrl, songName, artistName, views, duration, songLink, platform }) => {
  const [showOptionsDialog, setShowOptionsDialog] = useState(false);
  const [showIcons, setShowIcons] = useState(true);

  const handlePlay = () => {
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
                <img className="thumbnail" src={thumbnailUrl} alt="Album Thumbnail" />
                
                <PlayIcon className="play-icon" onClick={handlePlay}/>
            </div>
            <div className="details">
                <div className="name">{songName}</div>
                <div className="views">{views}</div>
                <div className="artist-name">{artistName}</div>
            </div>
        </div>
        <div className="views">{views}</div>
            {showIcons && (
              <div className="stats">
              <HeartIcon className="heart-icon" onClick={handleFavorite}/>
              <div className="duration">{duration}</div>
              <OptionsIcon className="options-icon" onClick={handleOptions}/>
              </div>
            )}
        
        {showOptionsDialog && (
          <Options songLink={songLink} platform={platform} onClose={closeOptionsDialog} />
        )}
    </div>
  );
};

export default SongResult;
