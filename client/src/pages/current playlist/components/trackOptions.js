import React, { useState, useEffect, useRef } from 'react';
import '../styles/trackOptions.css'
import '../../search/styles/Options.css'
import Options from "../../search/components/Options.js";
import TrackInfo from "./trackInfo.js";


const TrackOptions = ({ open, top, left, songObject }) => {


    const [optionsOpen, setOptionsOpen] = useState(false);
    const [optionsTop, setOptionsTop] = useState(false);
    const [optionsLeft, setOptionsLeft] = useState(false);

    const [creditsVisible, setCreditsVisible] = useState(false);

    let optionsPopupRef = useRef();
    let optionsRef = null;

    useEffect(() => {
        console.log("\r\nActual location: ", top, left);
    }, []);

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
        console.log("\r\noptionsLocation (trackOptions): ", optionsLocation.top, optionsLocation.left);
        optionsOnClick(optionsLocation.top, optionsLocation.left);
    };

    const handleShowCreditsClick = () => {
        setCreditsVisible(!creditsVisible);
    }


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
                {creditsVisible && <TrackInfo songObject={songObject} onClose={() => setCreditsVisible(false)} />}
                <div className="options-item" ref={el => optionsRef = el} onClick={handleAddToPlaylistClick}>Add to playlist </div>
                <div className="options-item" onClick={null}>Remove from playlist</div>
                <div className="options-item" onClick={handleShowCreditsClick}>Show credits</div>
            </div>
        </div>
    );
}

export default TrackOptions;