
import React, { useState, useEffect } from 'react';
import '../../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import '../styles/Preview.css';
import '../styles/SpAlbumPreview.css';
import '../styles/SpPlaylistPreview.css';
import { useRef } from "react";
import '../styles/YtPlaylistPreview.css';
import {editPlaylistAsync} from '../../../components/home/redux/thunks';
import { setPlaylist } from '../../../components/player/PlayerReducer';
import Options2 from '../components/Options2';

const { v4: uuid } = require('uuid');


const PlaylistResult = ({ className, playlistID, thumbnailUrl, playlistName, date,  duration, artistName, isFavorite, songs=[], playlistLink, deleteOnClick}) => {
  const [ioplaylistName, setPlaylistName] = useState(playlistName);

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [optionsTop, setOptionsTop] = useState(false);
  const [optionsLeft, setOptionsLeft] = useState(false);

  const dispatch = useDispatch();

  let optionsPopupRef = useRef();

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

  const optionsOnClick = (top, left) => {
    if (optionsOpen) {
      setOptionsOpen(false);
    } else {
      setOptionsTop(top + 21);
      setOptionsLeft(left - 45);
      setOptionsOpen(true);
    }
  };

  const handleInputChange = (event) => {
    setPlaylistName(event.target.value);
  };

  let optionsRef = null;

  const handlePlay = () => {
    // example of how you can load a playlist in the player. this is a temporary playlist and when we finish the api stuff we'll be using the data from songs instead

    dispatch(setPlaylist({
      id: uuid(),
      songs: [
        {
          link: "https://www.youtube.com/watch?v=C9K2b9yxjXg",
          type: "youtube",
          name: "Fuego",
          artist: "Eleni Foureira",
          image: "https://i.scdn.co/image/ab67616d00001e02ff9ca10b55ce82ae553c8228"
        },
        {
          link: "https://open.spotify.com/track/4bjN59DRXFRxBE1g5ne6B1?si=d40939f4f897437d",
          type: "spotify",
          name: "Haegeum",
          artist: "Agust D",
          image: "https://i.scdn.co/image/ab67616d0000b273fa9247b68471b82d2125651e"
        },
        {
          link: 'https://open.spotify.com/track/1zi7xx7UVEFkmKfv06H8x0?si=d0226490edb4470b',
          type: "spotify",
          name: 'One Dance',
          artist: "Drake",
          image: "https://i1.sndcdn.com/artworks-Vi8kWdDLyiHb-0-t500x500.jpg",
        },
      ]
    }));
  };

  const handleFavorite = () => {
    // Handle favorite button click
  };

  const handleOptions = () => {
    // Handle options button click
    const optionsLocation = optionsRef.getBoundingClientRect();
    optionsOnClick(optionsLocation.top, optionsLocation.left);
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
            <div ref={optionsPopupRef}>
              <OptionsIcon className="options-icon" onClick={handleOptions} ref={el => optionsRef = el}/>
              <Options2 open={optionsOpen} top={optionsTop} left={optionsLeft} deleteOnClick={deleteOnClick}/>
            </div>
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
