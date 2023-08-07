import React, { useEffect, useState } from 'react';

import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';

import * as Vibrant from 'node-vibrant';

import TrackEntry from './trackEntry';

import "../styles/playlistContainer.css";

import { getTotalTrackDuration } from './util';
import placeholderCover from '../../../images/album-placeholder.png';
import Spinner from '../../../components/spinner/spinner';
import PlaylistCreator from '../../playlists/components/PlaylistCreator';

const { TYPE_SPOTIFY, TYPE_YOUTUBE, TYPE_PLAYLIST, TYPE_ALBUM, TYPE_TRACK } = require("../../../typeConstants.js");


const PlaylistContainer = ({ loading, id, playlistLink, playlistName, type, artistName, releaseDate, thumbnailUrl, duration, isFavorited, description, songs }) => {
    const [creatorVisible, setCreatorVisible] = useState(false);

    const totalDuration = getTotalTrackDuration(songs);
    const thumbnailUrlSet = setThumbnail(thumbnailUrl);

    const closeCreator = () => {
        setCreatorVisible(false);
    }

    const handleAddClick = () => {
        setCreatorVisible(true);
    }

    function setThumbnail(thumbnailUrl) {
        if (!thumbnailUrl && songs && songs.length > 0 && thumbnailUrl.length === 0) {
            setHeaderGradient(songs[0].imageLink);
            return songs[0].imageLink;
        } else if (!songs || songs.length === 0) {
            return placeholderCover;
        } else return thumbnailUrl;
    }

    function setHeaderGradient(img) {
        Vibrant.from(img).getPalette((err, palette) => {
            if (err) {
                console.log("\r\nError getting palette for album gradient");
                console.log(err);
                return;
            }
            console.log(palette);
            const lightVibrantRGB = palette.LightVibrant._rgb;
            const darkVibrantRGB = palette.DarkVibrant._rgb;
            const playlistHeaderComponent = document.getElementsByClassName('playlist-header')[0];
            if (playlistHeaderComponent) playlistHeaderComponent.style.background = `linear-gradient(0deg, rgba(0, 0, 0, 1)
            20%, rgba(${darkVibrantRGB[0]}, ${darkVibrantRGB[1]}, ${darkVibrantRGB[2]}, 1)
            60%, rgba(${lightVibrantRGB[0]}, ${lightVibrantRGB[1]}, ${lightVibrantRGB[2]}, 1) 100%)`;
        });
    }

    useEffect(() => {
        if (thumbnailUrl) setHeaderGradient(thumbnailUrl);
        console.log(description);
    }, [thumbnailUrl]);

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
                        <p className='p'>{releaseDate} ・</p>
                        {type === TYPE_TRACK ? null : <p className='p'>{duration} songs,</p>}
                        <p className='p'>{totalDuration} duration</p>
                    </div>
                    {description ? <p className='info-description'>{description}</p> : null}
                </div>
            </div>

            <br></br>

            <div className='playlist-container'>
                {!loading ?
                    songs.map((track) => (
                        <TrackEntry
                            key={track.songID}
                            index={songs.findIndex(song => song.songID === track.songID)}
                            parentPlaylist={{ id, playlistLink, playlistName, type, artistName, releaseDate, thumbnailUrl, duration, isFavorited, description, songs }}
                            {...track}
                        />
                    ))
                :
                    <div className='spinner-container'>
                        <Spinner/>
                    </div>
                }
            </div>
            {creatorVisible &&
                <div className='creator-dialog-overlay'>
                    <PlaylistCreator onClose={closeCreator} />
                </div>
            }
        </div>
    );
}

export default PlaylistContainer;