import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import TrackEntry from './trackEntry';

import "../styles/playlistContainer.css";

import { getTotalTrackDuration } from './util';
import placeholderCover from '../../../images/album-placeholder.png';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../../../typeConstants.js");


const PlaylistContainer = ({ id, playlistLink, playlistName, type, artistName, releaseDate, thumbnailUrl, duration, isFavorite, songs }) => {

    const totalDuration = getTotalTrackDuration(songs);
    const thumbnailUrlSet = setThumbnail(thumbnailUrl);

    function setThumbnail(thumbnailUrl) {
        if (!thumbnailUrl && songs && songs.length > 0 && thumbnailUrl.length === 0) {
            return songs[0].imageLink;
        } else if (!songs || songs.length === 0)  {
            return placeholderCover;
        } else return thumbnailUrl;
    }

    return (
        <div className='background-container'>

            <div className="playlist-header">
                <div className="thumbnail-container">
                    <img className='thumbnail' src={thumbnailUrlSet} alt="Playlist Cover" />
                </div>
                <div className="info">
                    <h2 className='playlist-type'>{type}</h2>
                    <h1 className='playlist-title-1'>{playlistName}</h1>
                    <div className='info-footer'>
                        {/* <img className='author-profile-cover' src={authorCoverUrl} alt="Author cover" /> */}
                        <p className='p'>{artistName} ・</p>
                        <p className='p'>{duration} songs,</p>
                        <p className='p'>{totalDuration} seconds</p>
                    </div>
                </div>
            </div>

            <br></br>

            <div className='playlist-container'>
                {songs.map((track) => (
                    <TrackEntry
                    key={track.songID}
                    {...track}
                    />
                ))}
            </div>

        </div>



    );
}

export default PlaylistContainer;