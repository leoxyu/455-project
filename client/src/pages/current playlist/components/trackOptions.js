import React, { useState, useEffect, useRef } from 'react';
import '../styles/trackOptions.css'
import '../../search/styles/Options.css'
import Options from "../../search/components/Options.js";


const TrackOptions = ({ open, top, left, songObject }) => {


    const [optionsOpen, setOptionsOpen] = useState(false);
    const [optionsTop, setOptionsTop] = useState(false);
    const [optionsLeft, setOptionsLeft] = useState(false);

    let optionsPopupRef = useRef();
    let optionsRef = null;

    useEffect(() => {
        let optionsHandler = (e) => {
            if (!optionsPopupRef.current.contains(e.target)) {
                setOptionsOpen(false);
            }
        }

        document.addEventListener("mousedown", optionsHandler);

        return () => {
            document.removeEventListener("mousedown", optionsHandler);
        }
    });

    const optionsOnClick = (top, left) => {
        if (optionsOpen) {
            setOptionsOpen(false);
        } else {
            setOptionsTop(top - 15);
            setOptionsLeft(left - 120);
            setOptionsOpen(true);
        }
    };


    const handleAddToPlaylistClick = () => {
        const optionsLocation = optionsRef.getBoundingClientRect();
        optionsOnClick(optionsLocation.top, optionsLocation.left);
    };


    return (
        <div className={`track-options-container ${open ? "active" : "inactive"}`} style={{ top: top, left: left }}>
            <div ref={optionsPopupRef}>
                <Options
                    open={optionsOpen}
                    top={optionsTop}
                    left={optionsLeft}
                    songBody={songObject}
                    onClose={() => setOptionsOpen(false)}
                    handleAddClick={null}
                />
                <div className="options-item" ref={el => optionsRef = el} onClick={handleAddToPlaylistClick}>Add to playlist </div>
                <div className="options-item" onClick={null}>Remove from playlist</div>
                <div className="options-item" onClick={null}>Show credits</div>
            </div>
        </div>
    );
}

export default TrackOptions;