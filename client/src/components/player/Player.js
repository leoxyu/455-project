import { AiFillPlayCircle, AiFillPauseCircle } from 'react-icons/ai';
import { MdLoop, MdShuffle } from 'react-icons/md'
import { BiSkipNext, BiSkipPrevious, BiSolidVolumeFull } from 'react-icons/bi';
import "../../styles/Player.css";

export const Player = ({ playing, played, loop, volume, onPrev, onNext, onPlay, onPause, onLoop, onSeekMouseDown, onSeekMouseUp, onSeekChange, onVolumeChange, type, duration }) => {
    return (
        <div className="player-container">
          <BiSkipPrevious size="2rem" className="react-icon" onClick={onPrev}/>
          {!playing &&
            <AiFillPlayCircle size="2rem" className="react-icon" onClick={onPlay}/>
          }
          {playing &&
            <AiFillPauseCircle size="2rem" className="react-icon" onClick={onPause}/>
          }
          <BiSkipNext size="2rem" className="react-icon" onClick={onNext}/>
          <MdLoop size="1.5rem" className="react-icon" color={loop ? "rgb(105, 105, 105)" : "white"} onClick={onLoop}/>
          <MdShuffle size="1.5rem" className="react-icon"/>

          <input
            type='range' min={0} max={type === "youtube" ? 0.999999 : duration} step='any'
            value={played}
            onMouseDown={onSeekMouseDown}
            onChange={onSeekChange}
            onMouseUp={onSeekMouseUp}
          />
          <BiSolidVolumeFull size="1.5rem" className="react-icon"/>
          <input type='range' min={0} max={1} step='any' value={volume} onChange={onVolumeChange}/>
        </div>
    );
};