
import React from 'react';
import { useSelector } from 'react-redux';
import './styles/playlistPage.css';
import PlaylistContainer from "./components/playlistContainer.js";

const CurrentPlaylistPage = () => {
  // const currentPlaylist = useSelector(state => state.currentPlaylistPage.playlist);
  const currentPlaylist = useSelector(state => state.player.playlist);

  return (
    <div>
      <PlaylistContainer
        playlist={currentPlaylist}
      />
    </div>
  );
}

export default CurrentPlaylistPage;
