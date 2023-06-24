
import React from 'react';
import '../../../styles/variables.css';
import { ReactComponent as PlayIcon } from '../../../images/play.svg';
import { ReactComponent as HeartIcon } from '../../../images/favorite.svg';
import { ReactComponent as OptionsIcon } from '../../../images/options.svg';
import '../styles/Preview.css';
import '../styles/SpAlbumPreview.css';
import '../styles/SpPlaylistPreview.css';
import '../styles/YtPlaylistPreview.css';

const PlaylistResult = ({ className, playlistId, thumbnailUrl, playlistName, date,  duration, artistName, isFavorite, songs=[], playlistLink }) => {
  const handlePlay = () => {
    // Handle play button click
  };

  const handleFavorite = () => {
    // Handle favorite button click
  };

  const handleOptions = () => {
    // Handle options button click
  };

  return (
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



