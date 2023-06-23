import React from 'react';
import '../../../styles/variables.css';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import '../styles/SongResult.css';

const SongResult = ({ className, thumbnailUrl, songName, artistName, views, duration, songLink }) => {
  const handlePlay = () => {
    // Handle play button click
  };

  const handleFavorite = () => {
    // Handle favorite button click
  };

  const handleOptions = () => {
    // Handle options button click
  };

  return (
    <div className={className}>
        <div className='essential-info'>
            <div className="thumbnail-container">
                <img className="thumbnail" src={thumbnailUrl} alt="Album Thumbnail" />
                <PlayIcon className="play-icon" onClick={handlePlay}/>
            </div>
            <div className="song-details">
                <div className="song-name">{songName}</div>
                <div className="views">{views}</div>
                <div className="artist-name">{artistName}</div>
            </div>
        </div>
        <div className="views">{views}</div>
        <div className="song-stats">
            <HeartIcon className="heart-icon" onClick={handleFavorite}/>
            <div className="duration">{duration}</div>
            <OptionsIcon className="options-icon" onClick={handleOptions}/>
        </div>
    </div>
  );
};

export default SongResult;
