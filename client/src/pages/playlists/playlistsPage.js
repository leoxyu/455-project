import React, { useState, useEffect } from 'react';
import '../../styles/variables.css';
import { useSelector, useDispatch } from 'react-redux';
import {getPlaylistsAsync, deletePlaylistAsync} from '../../components/home/redux/thunks';
import '../../styles/PlaylistsPage.css';
import SearchBar from '../search/components/SearchBar';
import PlaylistResult from '../search/components/PlaylistResult';
import Filters from '../search/components/Filters';
import PlaylistCreator from './components/PlaylistCreator';
import { ReactComponent as AddIcon } from '../../images/add.svg';
import '../search/styles/Preview.css';
import PlaylistEditor from './components/PlaylistEditor';


const PlaylistPage = () => {
  const [creatorVisible, setCreatorVisible] = useState(false);
  const [editVisible, setEditVisible] = useState(false);
  const [playlistToEdit, setPlaylistToEdit] = useState(false);

  useEffect(() => {
    document.title = "Uni.fi - Playlists"; // Change the webpage title

    // Clean up the effect

  }, []);

  const playlists = useSelector(state => state.playlists.playlists);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getPlaylistsAsync());
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

      <SearchBar placeholder='Search for playlist'/>
      <Filters filters={['All', 'Uni.fi', 'Spotify', 'YouTube']}/>

      {creatorVisible &&
        <div className='creator-dialog-overlay'>
          <PlaylistCreator onClose={closeCreator}/>
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
      <div className='unifi-playlists-list' style={{display:'flex', 'flex-wrap': 'wrap'}}>
        <div className='adder' onClick={handleAddClick}>
        <div className='add-icon-container'>
        <AddIcon className='add-icon'/>
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
          />
        ))}
      </div>
    </div>
  );
};



export default PlaylistPage;
