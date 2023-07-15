
import React, { useState } from 'react';
import '../../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import '../styles/Preview.css';
import '../styles/SpAlbumPreview.css';
import '../styles/SpPlaylistPreview.css';
import '../styles/YtPlaylistPreview.css';
import {editPlaylistAsync} from '../../../components/home/redux/thunks';
import { setPlaylist } from '../../../components/player/PlayerReducer';
const { v4: uuid } = require('uuid');


const PlaylistResult = ({ className, thumbnailUrl, playlistName, date,  duration, artistName, isFavorite, songs=[], playlistLink, optionsOnClick}) => {
  const [ioplaylistName, setPlaylistName] = useState(playlistName);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setPlaylistName(event.target.value);
  };

  const handlePlay = () => {
    // example of how youc an load a playlist in the player. this is a temporary playlist and when we finish the api stuff we'll be using the data from songs instead

    dispatch(setPlaylist({
      id: uuid(),
      songs
    }));
  };

  const handleFavorite = () => {
    // Handle favorite button click
  };

  const handleOptions = () => {
    // Handle options button click
    optionsOnClick();
  };

  //  TODO avoid rendering if we use none in css

  return (
    <div>
    <div className={className}>
        <div className='essential-info'>
            <div className="thumbnail-container">
                <img className="thumbnail" src={thumbnailUrl} alt="Album Thumbnail" />
                <PlayIcon className="play-icon" onClick={handlePlay}/>
            </div>
            <div className="details">
                <div className="name">{playlistName}</div>
                <div className="secondary-details">
                <div className="date">{date}</div>
                <div className="artist-name">{artistName}</div>
                </div>
                <div className="optional-details">
                {songs.slice(0,3).map((song) => (
                <div className="song">{song.songName}</div>
                ))}
                </div>
            </div>
        </div>
        <div className="stats">
            <HeartIcon className="heart-icon" onClick={handleFavorite}/>
            <div className="duration">{duration}</div>
            <OptionsIcon className="options-icon" onClick={handleOptions}/>
        </div>
      </div>
        </div>
  );
};

export default PlaylistResult;


// playlistID: 1004,
//         name: 'songs',
//         artist: 'User',
//         date: '2023-06-09',
//         length: 812,
//         albumCover: "(some-image-URL)",
//         isFavorited: false,
//         songs: [
//             4415,
//             1151
//         ]
