import React, { useState, useEffect } from 'react';
import '../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import { getPlaylistsAsync, deletePlaylistAsync } from '../../components/home/redux/thunks';
import '../../styles/PlaylistsPage.css';
import PlaylistResult from '../search/components/PlaylistResult';
import PlaylistCreator from './components/PlaylistCreator';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import '../search/styles/Preview.css';
import PlaylistEditor from './components/PlaylistEditor';
import { ReactComponent as SearchIcon } from '../../images/search.svg'
import { ReactComponent as ClearIcon } from '../../images/clear.svg';



// used to determine type of popup of options menu on playlist component
import { OPTIONS_TYPE2 } from '../../typeConstants';

const PLACEHOLDER = 'Search for playlist...';

const PlaylistPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('');
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const playlists = useSelector(state => state.playlists.playlists);
  const lastId = useSelector(state => state.playlists.lastId);
  const dispatch = useDispatch();

  const filteredPlaylists = playlists.filter((playlist) => {
    // Check if selectedFilter matches or is empty
    if (selectedFilter !== '' && playlist.source !== selectedFilter) {
      return false;
    }

    // Check if searchTerm is present in the playlist name or artist name
    const searchTermInName = playlist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const searchTermInArtist = playlist.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return searchTermInName || searchTermInArtist;
  });

  // testing out pagination
  // TODO: add actual infinite scroll component
  useEffect(() => {
    let ignore = false;
    setTimeout(() => {
      if (!ignore) {
        dispatch(getPlaylistsAsync());
      }
    }, 300);
    return () => {
      ignore = true;
    };
  }, [lastId]);

  useEffect(() => {
    document.title = "Uni.fi - Playlists"; // Change the webpage title
    if (firstRender) setFirstRender(false);
    // Clean up the effect
  }, []);


  const handleAddClick = () => {
    setCreatorVisible(true);
  }

  const closeCreator = () => {
    setCreatorVisible(false);
  }

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const onDelete = (playlistId) => {
    dispatch(deletePlaylistAsync(playlistId));
  };

  const handleClickEdit = (playlist) => {
    setPlaylistToEdit(playlist);
    setEditVisible(true);
  };

  const filterAll = () => {
    setSelectedFilter('');
  }

  const filterUnifi = () => {
    setSelectedFilter('unifi');
  }

  const filterSpotify = () => {
    setSelectedFilter('spotify');
  }

  const filterYoutube = () => {
    setSelectedFilter('youtube');
  }

  return (
    <div className='playlists-page'>

      <div className="search-bar">
        <SearchIcon className="search-icon" />
        <input
          type="text"
          value={searchTerm}
          onChange={handleSearch}
          placeholder={PLACEHOLDER}
        />
        {searchTerm && (
          <button className="clear-button" onClick={clearSearch}>
            <ClearIcon className="clear-icon" />
          </button>
        )}
      </div>

      <div className="filters">
        <button className="filter-button" onClick={filterAll}>All</button>
        <button className="filter-button" onClick={filterUnifi}>Uni.fi</button>
        <button className="filter-button" onClick={filterSpotify}>Spotify</button>
        <button className="filter-button" onClick={filterYoutube}>YouTube</button>
      </div>

      {creatorVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistCreator onClose={closeCreator} />
        </div>
      }
      {editVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistEditor
            playlist={playlistToEdit}
            onClose={() => setEditVisible(false)}
          />
        </div>
      }

      <h2 className='playlists-heading'>Your Playlists</h2>
      <div className='unifi-playlists-list' style={{ display: 'flex', flexWrap: 'wrap' }}>
        <div className='adder' onClick={handleAddClick}>
          <div className='add-icon-container'>
            <AddIcon className='add-icon' />
          </div>
          <p className='add-text'>New Playlist</p>
        </div>
        {filteredPlaylists.map((playlist) => (
          <PlaylistResult
            key={playlist.playlistID}
            className={'spotify-playlist-preview'}
            playlistID={playlist.playlistID}
            thumbnailUrl={playlist.coverImageURL}
            playlistName={playlist.name}
            artistName={playlist.artist}
            songs={playlist.songs}
            deleteOnClick={() => onDelete(playlist.playlistID)}
            editOnClick={() => handleClickEdit(playlist)}
            isEditable={false}
            optionType={OPTIONS_TYPE2}
            duration={playlist.songs?.length}
            isFavorite={playlist.isFavorited}
            releaseDate={playlist.dateCreated}
            source={playlist.source}
            type={playlist.type}
            description={playlist.description}
            playlistObject={playlist}
          />
        ))}
      </div>
      <h2 className='playlists-heading'>Favorited Playlists</h2>
      <div className='unifi-playlists-list' style={{display:'flex', flexWrap: 'wrap'}}>
        {playlists.map((playlist, i) => (
          <div key={i}>
            {playlist.isFavorited && <PlaylistResult
              key={playlist.playlistID}
              className={'spotify-playlist-preview'}
              playlistID={playlist.playlistID}
              thumbnailUrl={playlist.coverImageURL}
              playlistName={playlist.name}
              artistName={playlist.artist}
              songs={playlist.songs}
              deleteOnClick={() => onDelete(playlist.playlistID)}
              editOnClick={() => handleClickEdit(playlist)}
              isEditable={false}
              optionType={OPTIONS_TYPE2}
              duration={playlist.songs?.length}
              isFavorited={true}
              releaseDate={playlist.dateCreated}
              source={playlist.source}
              type={playlist.type}
              description={playlist.description}
              playlistObject={playlist}
            />}
          </div>
        ))}
      </div>
    </div>
  );
};



export default PlaylistPage;
