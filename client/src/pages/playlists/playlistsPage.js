import React, { useState, useEffect } from 'react';
import '../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import { getPlaylistsAsync, deletePlaylistAsync } from '../../components/home/redux/thunks';
import '../../styles/PlaylistsPage.css';
import SearchBar from '../search/components/SearchBar';
import PlaylistResult from '../search/components/PlaylistResult';
import Filters from '../search/components/Filters';
import PlaylistCreator from './components/PlaylistCreator';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import '../search/styles/Preview.css';
import PlaylistEditor from './components/PlaylistEditor';


// used to determine type of popup of options menu on playlist component
import { OPTIONS_TYPE2, OPTIONS_TYPE3 } from '../../typeConstants';

const PlaylistPage = () => {
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState(false);
  const [firstRender, setFirstRender] = useState(true);
  const playlists = useSelector(state => state.playlists.playlists);
  const lastId = useSelector(state => state.playlists.lastId);
  const dispatch = useDispatch();


  // useEffect(() => {
  //   dispatch(getPlaylistsAsync());
  // }, [dispatch]);

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


  const handleSearch = async () => {

    //  do something
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

      <SearchBar placeholder='Search for playlist' />
      <Filters filters={['All', 'Uni.fi', 'Spotify', 'YouTube']} />

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
      <div className='unifi-playlists-list' style={{ display: 'flex', 'flex-wrap': 'wrap' }}>
        <div className='adder' onClick={handleAddClick}>
          <div className='add-icon-container'>
            <AddIcon className='add-icon' />
          </div>
          <p className='add-text'>New Playlist</p>
        </div>
        {playlists.map((playlist) => (
          <PlaylistResult
            key={playlist.playlistID}
            className={'spotify-playlist-preview'}
            playlistID={playlist.playlistID}
            thumbnailUrl={playlist.coverImageURL}
            playlistName={playlist.name}
            artistName={playlist.author}
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
          />
        ))}
      </div>
    </div>
  );
};



export default PlaylistPage;
