import React, {useEffect} from 'react';
import './PlaylistGrid.css';
import '../../styles/App.css';
import { useSelector, useDispatch } from 'react-redux';
import {getPlaylistsAsync} from './redux/thunks';

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
