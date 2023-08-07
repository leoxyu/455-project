import { store } from "./store";
import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { useDispatch } from 'react-redux';
import { getOnePlaylist } from "./components/home/redux/thunks";

export const getUserId = () => {
    return store.getState().login.id;
}

export const getAuthorID = () => {
    return store.getState().login.authorID;
}

export const useLazyLoadSongs = (playlist, id) => {
    const [loading, setLoading] = useState(true);
    const firstLoad = useRef(true);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!playlist?.songs?.length && firstLoad.current) {
            firstLoad.current = false;
            setTimeout(() => dispatch(getOnePlaylist(id)), 500);
        } else if (playlist?.songs?.length || !firstLoad.current) {
            setLoading(false);
        }
    }, [playlist]);
  return loading;
}
