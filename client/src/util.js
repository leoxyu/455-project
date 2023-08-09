import { store } from "./store";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useDispatch } from 'react-redux';
import { getOnePlaylist } from "./components/home/redux/thunks";
import { TYPE_ALBUM, TYPE_PLAYLIST, TYPE_SPOTIFY } from "./typeConstants";
import { getSpotifyAlbumByIDAsync, getSpotifyPlaylistByIDAsync, getYoutubePlaylistByIDAsync } from "./pages/search/redux/thunks";

export const getUserId = () => {
  return store.getState().login.id;
};

export const getAuthorID = () => {
  return store.getState().login.authorID;
};

export const useLazyLoadSongs = (playlist, id, type=null, source=null) => {
  const [loading, setLoading] = useState(true);
  const firstLoad = useRef(true);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!playlist?.songs?.length && firstLoad.current) {
      firstLoad.current = false;
      if (!type && !source) {
        setTimeout(() => dispatch(getOnePlaylist(id)), 500);
      } else if (type === TYPE_PLAYLIST && source===TYPE_SPOTIFY) {
        const accessToken = store.getState().spotify.access_token;
        setTimeout(() => dispatch(getSpotifyPlaylistByIDAsync({accessToken, id})), 500);
      } else if (type === TYPE_ALBUM) {
        const accessToken = store.getState().spotify.access_token;
        setTimeout(() => dispatch(getSpotifyAlbumByIDAsync({accessToken, id})), 500);
      } else {
        setTimeout(() => dispatch(getYoutubePlaylistByIDAsync(id)), 500);
      }
    } else if (playlist?.songs?.length || !firstLoad.current) {
      setLoading(false);
    }
  }, [playlist]);
  return loading;
};
