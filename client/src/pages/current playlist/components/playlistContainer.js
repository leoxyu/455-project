import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import "../styles/playlistContainer.css";

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../redux/typeConstants.js");


const PlaylistContainer = ({ playlistId, playlistLink, playlistObjectId, playlistName, playlistType, author, authorCoverUrl, authorUserId, releaseDate, type, coverUrl, numTracks, totalDuration, isFavorite, tracks}) => {

    return (
        <div className="playlist-header">
            <div className="cover">
                <img src={coverUrl} alt="Playlist Cover" />
            </div>
            <div className="info">
                <h2>{playlistType}</h2>
                <h1>{playlistName}</h1>
                <p>{author}</p>
                <p>{numTracks} songs</p>
                <p>{totalDuration} minutes</p>
            </div>


            <div className='playlist-container'>
                {tracks.map((track) => (
                    <trackEntry
                    trackName = {track.trackName}
                    />
                ))}
            </div>
        </div>




    );
}

export default PlaylistContainer;