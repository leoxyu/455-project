import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import TrackEntry from './trackEntry';

import "../styles/playlistContainer.css";

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../redux/typeConstants.js");


const PlaylistContainer = ({ playlistId, playlistLink, playlistObjectId, playlistName, playlistType, author, authorCoverUrl, authorUserId, releaseDate, type, coverUrl, numTracks, totalDuration, isFavorite, tracks }) => {

    return (
        <div className='background-container'>

            <div className="playlist-header">
                <div className="thumbnail-container">
                    <img className='thumbnail' src={coverUrl} alt="Playlist Cover" />
                </div>
                <div className="info">
                    <h2 className='playlist-type'>{playlistType}</h2>
                    <h1 className='playlist-title-1'>{playlistName}</h1>
                    <div className='info-footer'>
                        <img className='author-profile-cover' src={authorCoverUrl} alt="Author cover" />
                        <p className='p'>{author} ・</p>
                        <p className='p'>{numTracks} songs,</p>
                        <p className='p'>{totalDuration} seconds</p>
                    </div>
                </div>
            </div>

            <br></br>

            <div className='playlist-container'>
                {tracks.map((track) => (
                    <TrackEntry
                    key={track.trackObjectId}
                    
                    {...track}
                    />
                ))}
            </div>

        </div>



    );
}

export default PlaylistContainer;