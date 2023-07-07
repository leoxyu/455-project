import React, { useState } from 'react';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import "../styles/currentPlaylistTrack.css";


const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../redux/Constants.js");


const trackEntry = ({ trackId, trackObjectId, trackName, artist, duration, album, isFavorite, type, link, coverUrl, releaseDate, popularity, handleDropdown = () => { } }) => {


    return (
        <div>
            <h1>{trackName}</h1>
        </div>




    );

}