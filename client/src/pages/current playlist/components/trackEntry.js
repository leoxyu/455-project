import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
// import { ReactComponent as PlayingIcon } from "../../../images/playingWave.gif";

import TrackOptions from "./trackOptions.js";


import PlayingIcon from "../../../images/playingWave.gif";
import "../styles/playlistTrack.css";

import { setCurrSongID } from "../../../components/player/PlayerReducer.js";
import { setCurrSongIdPlaylistPage } from '../redux/currentPlaylistReducer';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM } = require("../../../typeConstants.js");


const TrackEntry = ({ songID, name, artist, duration, album, isFavorite, link, imageLink, releaseDate, source, index, songObject }) => {

    const dispatch = useDispatch();
    const currSongID = useSelector(state => state.currentPlaylistPage.currSongID);
    const trackDuration = convertMsToDuration(duration);

    // const [subOptionsOpen, setSubOptionsOpen] = useState(false);
    // const [subOptionsTop, setSubOptionsTop] = useState(false);
    // const [subOptionsLeft, setSubOptionsLeft] = useState(false);

    const [optionsOpen, setOptionsOpen] = useState(false);
    const [optionsTop, setOptionsTop] = useState(false);
    const [optionsLeft, setOptionsLeft] = useState(false);

    let optionsPopupRef = useRef();
    let optionsRef = null;


    const optionsOnClick = (top, left) => {
        if (optionsOpen) {
            setOptionsOpen(false);
        } else {
            setOptionsTop(top - 125);
            setOptionsLeft(left - 155);
            setOptionsOpen(true);
        }
    };

    function convertMsToDuration(duration) {
        if (typeof (duration) === 'number') {
            return new Date(duration).toISOString().slice(11, 19);
        } else return duration;
    }

    // this block closes the options popup when the user clicks outside of it
    useEffect(() => {
        
        let optionsHandler = (e) => {
            if (!optionsPopupRef.current.contains(e.target)) {
                setOptionsOpen(false);
            }
        }

        document.addEventListener("mousedown", optionsHandler);

        return () => {
            document.removeEventListener("mousedown", optionsHandler);
        }
    });



    useEffect(() => {
        if (currSongID && currSongID.songID === songID) {
            // highlight the current track object
        }
    }, [currSongID]);

    const handlePlay = () => {
        // Handle play button click
        dispatch(setCurrSongID(songID));
        dispatch(setCurrSongIdPlaylistPage(songID));
    };

    const handleFavorite = () => {
        // Handle favorite button click
    };

    const handleOptions = () => {
        const optionsLocation = optionsRef.getBoundingClientRect();
       
        optionsOnClick(optionsLocation.top + window.scrollY, optionsLocation.left);
    };


    const isCurrentlyPlaying = currSongID === songID;

    return (
        <div className="track-container">
            <div className="track-container-left">
                <p className={"track-id-" + (isCurrentlyPlaying ? 'active' : 'inactive')}>{index + 1}</p>
                {isCurrentlyPlaying ? <img className="playing-icon" src={PlayingIcon} />
                    : <PlayIcon className="play-icon" onClick={handlePlay} />}
                <img className='track-cover' src={imageLink} alt="Track Cover" />
                <p className={"name-" + (isCurrentlyPlaying ? 'active' : 'inactive')}>{name}</p>
            </div>
            <div className="track-container-right">
                <HeartIcon className="heart-icon" onClick={handleFavorite} />
                <p className="track-duration">{trackDuration}</p>

                <div ref={optionsPopupRef}>
                    <OptionsIcon className="options-icon" onClick={handleOptions} ref={el => optionsRef = el} />
                    <TrackOptions open={optionsOpen} top={optionsTop} left={optionsLeft} songObject = {songObject} />
                </div>
            </div>
        </div>






    );

}

export default TrackEntry;