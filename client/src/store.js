import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './pages/login/redux/loginReducer';
import homepageReducer from './pages/homepage/redux/homepageReducer';
import spotifyReducer from './components/Oauth/spotifyApiReducer';
import playlistsReducer from './components/home/redux/playlistsReducer';
import PlayerReducer from './components/player/PlayerReducer';
import searchReducer from './pages/search/redux/reducer';
import youtubeApiReducer from './components/Oauth/youtubeApiReducer';


export const store = configureStore({
  reducer: {
    login: loginReducer,
    homepage: homepageReducer,
    spotify: spotifyReducer,
    playlists: playlistsReducer,
    player: PlayerReducer,
    search: searchReducer,
    youtube: youtubeApiReducer
  },
  devTools: true
});