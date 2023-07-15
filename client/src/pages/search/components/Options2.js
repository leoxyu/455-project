import React from "react";
import '../styles/Options2.css';

const Options2 = ({ open, top, left, deleteOnClick, editOnClick }) => {

  return (
    <div className={`options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
        <div className="options-item" onClick={editOnClick}>Edit</div>
        <div className="options-item" onClick={deleteOnClick}>Delete</div>
    </div>
  );
}

export default Options2;
