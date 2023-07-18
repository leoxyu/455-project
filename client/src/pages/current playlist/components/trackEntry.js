import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import "../styles/playlistTrack.css";


const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../redux/typeConstants.js");


const TrackEntry = ({ trackId, trackObjectId, trackName, artist, duration, album, isFavorite, type, link, coverUrl, releaseDate, popularity, handleDropdown = () => { } }) => {

    const trackDuration = new Date(duration * 1000).toISOString().slice(11, 19);

    const handlePlay = () => {
        // Handle play button click
    };

    const handleFavorite = () => {
        // Handle favorite button click
    };

    const handleOptions = () => {
    };


    return (
        <div>
            <div className="track-container">
            <div className="track-container-left">
                <p className="track-id">{trackId}</p>
                <PlayIcon className="play-icon" onClick={handlePlay} />
                <img className='track-cover' src={coverUrl} alt="Track Cover" />
                <p className="p">{trackName}</p>
            </div>
            <div className="track-container-right">
                <HeartIcon className="heart-icon" onClick={handleFavorite} />
                <p className="track-duration">{trackDuration}</p>
                <OptionsIcon className="options-icon" onClick={handleOptions} />
            </div>
        </div>
        <div className='info-track-container'>
            <img className='info-track-cover' src={coverUrl} alt="Track Cover" />
            </div>
        </div>






    );

}

export default TrackEntry;