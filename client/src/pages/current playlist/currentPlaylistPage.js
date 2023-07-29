
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import './styles/playlistPage.css';

import PlaylistContainer from "./components/playlistContainer.js";

const CurrentPlaylistPage = () => {

    // const currentPlaylist = useSelector(state => state.currentPlaylistPage.playlist);
    const currentPlaylist = useSelector(state => state.player.playlist);
    
    const dispatch = useDispatch();

    return (
        <div>
            <PlaylistContainer
                {...currentPlaylist}
            />
        </div>
    );
}


export default CurrentPlaylistPage;