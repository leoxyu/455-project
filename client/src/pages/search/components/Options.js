import React, { useState, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {addSongAsync, getPlaylistsAsync} from '../../../components/home/redux/thunks';
import '../../../styles/variables.css';
import '../styles/Options.css';
import SearchBar from './SearchBar';


const Options = ({ songLink, onClose=()=>{}, platform }) => {
  const playlists = useSelector((state) => state.playlists.playlists);
  
  const dispatch = useDispatch();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');
  useEffect(() => {
    dispatch(getPlaylistsAsync());
  }, []);

  const handlePlaylistChange = (event) => {
    setSelectedPlaylist(event.target.value);
    // setSelectedPlaylist('wtf');
  };

  const handleSelection = (event) => {
    // Handle playlist selection
    // console.log(`Selected playlist: ${selectedPlaylist}`);
    const data = {
        URI: songLink,
        source: platform
    };

    // const fakedata = {
    //     name: selectedPlaylist + 'lol',
    //     songs: []
    // }

    // dispatch(createPlaylistAsync(fakedata));
    //  so selected playlist works ....
    dispatch(addSongAsync(event.target.value, data));
    onClose(); // Trigger the onClose callback
  };

  return (
    <div className='options-dialog'>
      <p className='options-title'>Add to playlist:</p>
      <SearchBar />
        <div className="options-playlist-input">
          New playlist
        </div>
      <div className="options-dropdown">
        {/* add search bar here*/}
        {playlists.map((playlist) => (
          <div
          className="options-playlist-input"
          value={playlist.playlistID}
          onClick={handleSelection}>
          {playlist.name}
          </div>
        ))}
      </div>
      {/* <button onClick={handleSelection}>Add</button> */}
    </div>
  );
};

export default Options;
