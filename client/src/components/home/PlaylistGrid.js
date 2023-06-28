import React, {useEffect} from 'react';
import './PlaylistGrid.css'; // Import the CSS file for styling
import '../../styles/App.css';
import { useSelector, useDispatch } from 'react-redux';
import {getPlaylistsAsync} from './redux/thunks';

// const playlists = [
//   {
//     id: 1,
//     name: 'Playlist 1',
//     image: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',
//     creator: 'John Doe'
//   },
//   {
//     id: 2,
//     name: 'Playlist 2',
//     image: 'https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg',
//     creator: 'Jane Smith'
//   },
//   // Add more playlists as needed
// ];

const PlaylistCard = ({ playlist }) => {
  return (
    <div className="playlist-card website-highlight3">
      <img src={playlist.coverImageURL} alt={playlist.name} className="playlist-image" />
      <div className="playlist-details">
        <div className="playlist-name">{playlist.name}</div>
        <div className="playlist-creator">Created by {playlist.author}</div>
      </div>
    </div>
  );
};

const PlaylistGrid = () => {
  const playlists = useSelector(state => state.playlists.playlists);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPlaylistsAsync());
  }, []);

  return (
    <div className="playlist-grid">
      {playlists.map(playlist => (
        <PlaylistCard key={playlist.id} playlist={playlist} />
      ))}
    </div>
  );
};

export default PlaylistGrid;

