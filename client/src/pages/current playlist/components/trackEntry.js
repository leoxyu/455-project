import React, { useState, useEffect, useRef } from 'react';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import "../styles/playlistTrack.css";


const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../../../typeConstants.js");


const TrackEntry = ({ songID, name, artist, duration, album, isFavorite, link, imageLink, releaseDate, source, handleDropdown = () => { } }) => {

    function convertMsToDuration(duration) {
        if (typeof(duration) === 'number') {
            return new Date(duration).toISOString().slice(11, 19);
        } else return duration;
    }


    const trackDuration = convertMsToDuration(duration);

    const handlePlay = () => {
        // Handle play button click
    };

    const handleFavorite = () => {
        // Handle favorite button click
    };

    const handleOptions = () => {
    };


    return (
        <div className="track-container">
            <div className="track-container-left">
                <p className="track-id">{songID}</p>
                <PlayIcon className="play-icon" onClick={handlePlay} />
                <img className='track-cover' src={imageLink} alt="Track Cover" />
                <p className="p">{name}</p>
            </div>
            <div className="track-container-right">
                <HeartIcon className="heart-icon" onClick={handleFavorite} />
                <p className="track-duration">{trackDuration}</p>
                <OptionsIcon className="options-icon" onClick={handleOptions} />
            </div>
        </div>






    );

}

export default TrackEntry;