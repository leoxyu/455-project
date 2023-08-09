import React, { useState, useEffect, useRef } from 'react';
import '../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import InfiniteScroll from 'react-infinite-scroll-component';
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
import Filters from '../search/components/Filters';
import { Link } from 'react-router-dom';

const PLACEHOLDER = 'Search for playlist...';

const PlaylistPage = () => {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState(false);
  const initialFetched = useRef(false);
  const [initialFetchDone, setInitialFetchDone] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const playlists = useSelector(state => state.playlists.playlists);
  const dispatch = useDispatch();

  const filteredPlaylists = playlists.filter((playlist) => {
    // Check if selectedFilter matches or is empty

    const filterNameMap = { All: 'All', Spotify: 'spotify', YouTube: 'youtube', 'Uni.fi': 'unifi' };

    if (selectedFilter === 'Favorited' && !playlist.isFavorited) {
      return false;
    } else if (selectedFilter !== 'Favorited' && selectedFilter !== 'All' && playlist.source !== filterNameMap[selectedFilter]) {
      return false;
    }

    // Check if searchTerm is present in the playlist name or artist name
    const searchTermInName = playlist.name.toLowerCase().includes(searchTerm.toLowerCase());
    const searchTermInArtist = playlist.artist.toLowerCase().includes(searchTerm.toLowerCase());
    return searchTermInName || searchTermInArtist;
  });

  useEffect(() => {
    document.title = "Uni.fi - Playlists"; // Change the webpage title
    // Clean up the effect
  }, []);

  useEffect(() => {
    async function fetchData() {
      // initial fetch some pages sequentially without having to scroll
      if (!initialFetched.current) {
        for (let i = 0; i < 5; i++) {
          await dispatch(getPlaylistsAsync({ isDeep: i === 0 ? true : false })).unwrap();
          setInitialFetchDone(true); // just triggers rerender
        }
      }
    }
    if (!playlists.length) {
      fetchData();
    } else {
      setInitialFetchDone(true); // just triggers rerender
    }
    return () => initialFetched.current = true
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

      <Filters selectedFilter={selectedFilter} setSelectedFilter={setSelectedFilter} filters={['All', 'Favorited', 'Uni.fi', 'Spotify', 'YouTube']} />

      {creatorVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistCreator onClose={closeCreator} />
        </div>
      }
      {editVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistEditor
            pl={playlistToEdit}
            onClose={() => setEditVisible(false)}
          />
        </div>
      }

      <h2 className='playlists-heading'>Your Playlists</h2>
      {initialFetched.current &&
        <InfiniteScroll
          dataLength={playlists.length}
          next={() => dispatch(getPlaylistsAsync({ isDeep: false }))}
          hasMore={true}
          scrollableTarget={'your-playlists'}
          // loader={<h4>loading</h4>}
          style={{ overflow: "unset" }}
        // scrollThreshold={0.5}
        >
          <div className='unifi-playlists-list' style={{ display: 'flex', flexWrap: 'wrap' }}>
            <div className='adder' onClick={handleAddClick}>
              <div className='add-icon-container'>
                <AddIcon className='add-icon' />
              </div>
              <p className='add-text'>New Playlist</p>
            </div>
            {filteredPlaylists.map((playlist) => (
              <Link to={`/playlists/${playlist.playlistID}`}
                style={{ color: 'inherit', textDecoration: 'inherit' }}
              >
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
              </Link>
            ))}
          </div>
        </InfiniteScroll>
      }
    </div>
  );
};

export default PlaylistPage;
