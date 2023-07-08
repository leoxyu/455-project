import React, { useState, useEffect, useRef } from "react";
import '../styles/Options2.css';

const Options2 = ({ open, top, left }) => {
  console.log(top, left);

  return (
    <div className={`options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
        <div className="options-item">Edit</div>
        <div className="options-item">Delete</div>
    </div>
  );
}

export default Options2;
