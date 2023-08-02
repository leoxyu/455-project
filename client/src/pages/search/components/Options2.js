import React from "react";
import '../styles/Options2.css';
import { useDispatch } from "react-redux";
import { editPlaylistAsync } from "../../../components/home/redux/thunks";

const Options2 = ({ open, top, left, deleteOnClick, editOnClick, isFavorited, playlistID }) => {
  const dispatch = useDispatch();

  const handleSetFavorite = () => {
    const playlistEdit = {
      playlistID: playlistID,
      isFavorited: !isFavorited
    };

    dispatch(editPlaylistAsync(playlistEdit));
  };

  return (
    <div className={`options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
        <div className="options-item" onClick={handleSetFavorite}>{isFavorited ? "Unfavorite" : "Favorite"}</div>
        <div className="options-item" onClick={editOnClick}>Edit</div>
        <div className="options-item" onClick={deleteOnClick}>Delete</div>
    </div>
  );
}

export default Options2;
