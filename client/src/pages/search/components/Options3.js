import React from "react";
import '../styles/Options2.css';

const Options3 = ({ open, top, left, playlistLink, playlistType, source, saveOnClick }) => {

  function handleClick() {
    saveOnClick(playlistLink, playlistType, source);
  }

  return (
    <div className={`options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
      <div className="options-item" onClick={handleClick}>Save to library</div>
    </div>
  );
}

export default Options3;