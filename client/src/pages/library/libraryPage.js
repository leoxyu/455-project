import React, { useState } from 'react';
import PlaylistsPage from '../playlists/playlistsPage';
import SongPage from '../songs/songPage';
import { ReactComponent as SongIcon } from '../../images/songs.svg';
import { ReactComponent as PlaylistIcon } from '../../images/playlist.svg';
import '../../styles/LibraryPage.css';

const LibraryPage = () => {
  const [selectedPage, setSelectedPage] = useState('Playlists');

  const handlePageChange = (page) => {
    setSelectedPage(page);
  };

  return (
    <div className='library-page'>
      <div className='page-selector-container'>
        <div className='page-selector-separator'/>
        <div className='page-selector'>
          <div className='library-button' onClick={() => handlePageChange('Playlists')} data-selected={selectedPage === 'Playlists' ? 'true' : 'false'}>
            <PlaylistIcon className='playlist-library-icon' />
          </div>
          <div className='library-button' onClick={() => handlePageChange('Songs')} data-selected={selectedPage === 'Songs' ? 'true' : 'false'}>
            <SongIcon className='song-library-icon' />
          </div>
        </div>
      </div>
      {selectedPage === 'Playlists' ? <PlaylistsPage /> : <SongPage />}
    </div>
  );
};

export default LibraryPage;
