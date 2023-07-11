import React, { useState } from 'react';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import "../styles/playlistTrack.css";


const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../redux/typeConstants.js");


const TrackEntry = ({ trackId, trackObjectId, trackName, artist, duration, album, isFavorite, type, link, coverUrl, releaseDate, popularity, handleDropdown = () => { } }) => {


    return (
        <div className="track-container">
            <p className="p">{trackId}</p>
            <p className="p">{trackName}</p>
        </div>




    );

}

export default TrackEntry;