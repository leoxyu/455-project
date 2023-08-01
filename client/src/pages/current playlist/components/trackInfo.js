import React, { useState, useEffect, useRef } from 'react';
import ReactDom from "react-dom";
import { useSelector, useDispatch } from 'react-redux';

import '../styles/trackInfo.css';

import { ReactComponent as CloseIcon } from '../../../images/close.svg';

const TrackInfo = ({ songObject, onClose }) => {


    return (
        <>
            <div className='modal-container'>
                <div className='header-container'>
                    <h2 className='header-title'>Credits</h2>
                    <CloseIcon className='close-icon' onClick={onClose} />
                </div>
                <div className='contents'>
                    <h3 className='category-title'>{songObject.name}</h3>

                    <h3 className='category-title'>Artist</h3>
                    <h3 className='category-text'>{songObject.artist}</h3>

                    <h3 className='category-title'>Source</h3>
                    <h3 className='category-text'>{songObject.source}</h3>

                    <h3 className='category-title'>Link</h3>
                    <h3 className='category-text'>{songObject.link}</h3>

                    {songObject.album && <h3 className='category-title'>Album</h3>}
                    {songObject.album && <h3 className='category-text'>{songObject.album}</h3>}
                </div>
            </div>
        </>
    );
}


export default TrackInfo;