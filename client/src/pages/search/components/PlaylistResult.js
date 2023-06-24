
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


const PlaylistResult = ({ className, playlistID, thumbnailUrl, playlistName, date,  duration, artistName, isFavorite, songs=[], playlistLink, optionsOnClick, isEditable=false}) => {
  const [ioplaylistName, setPlaylistName] = useState(playlistName);
  const dispatch = useDispatch();

  const handleInputChange = (event) => {
    setPlaylistName(event.target.value);
  };

  const editPlaylist = () => {
    // Replace this with your logic to create a new playlist
    // console.log(`Creating playlist: ${playlistName}`);
    const data = {
        name: ioplaylistName,
        songs: songs,
        author: artistName
    }
    dispatch(editPlaylistAsync(playlistID, data));
    // setPlaylistName('');
  };
  
  const handlePlay = () => {
    // Handle play button click
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
              {isEditable ? 
              <input
              type="text"
              value={ioplaylistName}
              onChange={handleInputChange}
              placeholder="Enter a new playlist name"
            /> :
                <div className="name">{playlistName}</div>
              }
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
      {isEditable &&
        <button onClick={editPlaylist}>Save Changes</button>
      }
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



