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
    // just a placeholder before we finalize the playlist & song fields
    setPlaylistToEdit({
      name: "Playlist Name",
      description: "Playlist description",
      coverImageURL: "https://www.ikea.com/ca/en/images/products/blahaj-soft-toy-shark__0710175_pe727378_s5.jpg",
      songs: [
        {
          thumbnailUrl: 'https://i.scdn.co/image/ab67616d0000b273fa9247b68471b82d2125651e',
          songName: 'Haegeum',
          artistName: 'Agust D',
          views: '123456',
          duration: '1:53',
          songLink: 'https://open.spotify.com/track/4bjN59DRXFRxBE1g5ne6B1?si=d40939f4f897437d'
        },
        {
          thumbnailUrl: 'https://i1.sndcdn.com/artworks-Vi8kWdDLyiHb-0-t500x500.jpg',
          songName: 'One Dance',
          artistName: 'Drake',
          views: '6942000',
          duration: '2:53',
          songLink: 'https://open.spotify.com/track/1zi7xx7UVEFkmKfv06H8x0?si=d0226490edb4470b'
        },
        {
          thumbnailUrl: 'https://static.wikia.nocookie.net/the-bangtan-boys/images/f/fb/Love_Yourself_%27Tear%27_album_cover.jpg',
          songName: 'FAKE LOVE',
          artistName: 'BTS',
          views: '34100000',
          duration: '4:02',
          songLink: 'https://open.spotify.com/track/6m1TWFMeon7ai9XLOzdbiR?si=85e1028488b9479c'
        },
        {
          thumbnailUrl: 'https://i.ytimg.com/vi/MAihF124EbE/maxresdefault.jpg',
          songName: 'Sugar',
          artistName: 'Maroon 5',
          views: '20001000',
          duration: '3:55',
          songLink: 'https://open.spotify.com/track/2iuZJX9X9P0GKaE93xcPjk?si=3a866fb1a7ec4062'
        }
      ]
    });
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
