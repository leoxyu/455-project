import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai';
import { MdLoop, MdShuffle } from 'react-icons/md'
import { BiSkipNext, BiSkipPrevious, BiSolidVolumeFull, BiSolidVolumeLow, BiSolidVolume, BiSolidVolumeMute } from 'react-icons/bi';
import "../../styles/Player.css";

export const Player = ({ name, artist, image, playing, played, loop, shuffle, volume, muted, onPrev, onNext, onPlay, onPause, onToggleLoop, onToggleShuffle, onSeekMouseDown, onSeekMouseUp, onSeekChange, onVolumeChange, onToggleMute, type, duration }) => {
    return (
      <>
        {type === "none" &&
          <div className="player-container">
            <div className="player-main">
              <div className="player-controls">
                <BiSkipPrevious size="32px" className="react-icon-disabled"/>
                <AiFillPlayCircle size="32px" className="react-icon-disabled"/>
                <BiSkipNext size="32px" className="react-icon-disabled"/>
                <MdLoop size="20px" className="react-icon-disabled"/>
                <MdShuffle size="20px" className="react-icon-disabled"/>
              </div>

              <input
                className="song-slider-disabled"
                type='range'
                min={0}
                max={1}
                value={0}
              />
            </div>

            <div className="player-audio">
              <BiSolidVolumeFull size="24px" className="react-icon-disabled"/>
              <input
                className="volume-slider-disabled"
                type='range'
                min={0}
                max={1}
                value={1}
              />
            </div>
          </div>
        }
        {type !== "none" &&
          <div className="player-container">
            <div className="song-info-container">
              <img src={image} alt="Cover Art" width="48px" height="48px"/>
              <div className="song-info">
                <div className="song-title">{name}</div>
                <div className="song-artist">{artist}</div>
              </div>
            </div>
            <div className="player-main">
              <div className="player-controls">
                <BiSkipPrevious size="32px" className="react-icon" onClick={onPrev}/>
                {!playing &&
                  <AiFillPlayCircle size="32px" className="react-icon" onClick={onPlay}/>
                }
                {playing &&
                  <AiFillPauseCircle size="32px" className="react-icon" onClick={onPause}/>
                }
                <BiSkipNext size="32px" className="react-icon" onClick={onNext}/>
                <MdLoop size="20px" className="react-icon" color={loop ? "#1db954" : undefined} onClick={onToggleLoop}/>
                <MdShuffle size="20px" className="react-icon" color={shuffle ? "#1db954" : undefined} onClick={onToggleShuffle}/>
              </div>

              <input
                className="song-slider"
                type='range'
                min={0}
                max={type === "youtube" ? 0.999999 : duration}
                step='any'
                value={played}
                onMouseDown={onSeekMouseDown}
                onChange={onSeekChange}
                onMouseUp={onSeekMouseUp}
              />
            </div>

            <div className="player-audio">
              {!muted && volume > 0.6 && <BiSolidVolumeFull size="24px" className="react-icon" onClick={onToggleMute}/>}
              {!muted && volume > 0.2 && volume <= 0.6 && <BiSolidVolumeLow size="24px" className="react-icon" onClick={onToggleMute}/>}
              {!muted && (volume <= 0.2 && volume > 0) && <BiSolidVolume size="24px" className="react-icon" onClick={onToggleMute}/>}
              {(muted || volume === 0) && <BiSolidVolumeMute size="24px" className="react-icon-mute" onClick={onToggleMute}/>}
              <input
                className="volume-slider"
                type='range'
                min={0}
                max={1}
                step='any'
                value={muted ? 0 : volume}
                onChange={onVolumeChange}
              />
            </div>
          </div>
        }
      </>
    );
};