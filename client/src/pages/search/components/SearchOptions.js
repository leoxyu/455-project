import React from "react";
import '../styles/Options2.css';

const SearchOptions = ({ open, top, left }) => {

  return (
    <div className={`options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
        <div className="options-item" onClick={() => null}>Edit</div>
        <div className="options-item" onClick={() => null}>Delete</div>
    </div>
  );
}

export default SearchOptions;
