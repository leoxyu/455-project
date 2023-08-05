import React from "react";
import '../styles/Options2.css';

const Options2 = ({ open, top, left, deleteOnClick, editOnClick, isFavorited, handleSetFavorite }) => {
  return (
    <div className={`options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
        <div className="options-item" onClick={(e) => { e.preventDefault(); handleSetFavorite(); }}>{isFavorited ? "Unfavorite" : "Favorite"}</div>
        <div className="options-item" onClick={(e) => { e.preventDefault(); editOnClick(); }}>Edit</div>
        <div className="options-item" onClick={(e) => { e.preventDefault(); deleteOnClick(); }}>Delete</div>
    </div>
  );
}

export default Options2;
