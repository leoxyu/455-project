import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Spinner from '../../components/spinner/spinner';


import { getYoutubePlaylists } from '../../components/Oauth/youtubeApiReducer';
import { youtubeProfileThunk } from '../../components/Oauth/Youtube/youtubeApiThunks';

const Preload = () => {
    let navigate = useNavigate();
    const playlists = useSelector(state => state.playlists.playlists);

    const dispatch = useDispatch();
    let access_token_youtube = useSelector(state => state.youtube.access_token);
    let youtube_profile = useSelector(state => state.youtube.profile);

    // fetches youtube playlists
    useEffect(() => {
        if (access_token_youtube && !youtube_profile) {
            // fetch profile info...
            const response = dispatch(youtubeProfileThunk(access_token_youtube));
            response.then((contents) => {
                dispatch(getYoutubePlaylists(contents.payload));
            });
        }
    }, []);

    useEffect(() => {
        console.log(playlists)
        if (playlists != null) {
            navigate('/home');
        }
    }, [playlists]);
    // Redirect to another component after loading data


    return (
        <div>
            <Spinner />
        </div>
    );
};

export default Preload;
