import React from 'react';
import ReactPlayer from 'react-player';
import PlaySvg from '../../images/play.svg';
import PauseSvg from '../../images/pause.svg';
import SkipSvg from '../../images/skip.svg';

export class YoutubePlayer extends React.Component {
  state = {
    // url: "https://www.youtube.com/watch?v=8SPtkjMUkGk",
    // playing: false,
    url: this.props.song,
    playing: this.props.playOnLoad,
    controls: false,
    volume: 1,
    played: 0,
    loaded: 0
  }

  load = url => {
    this.setState({
      url,
      played: 0,
      loaded: 0
    })
  }

  handleStop = () => {
    this.setState({ playing: false });
    this.player.seekTo(0);
  }

  handlePlay = () => {
    this.setState({ playing: true });
  }

  handlePause = () => {
    this.setState({ playing: false });
  }

  handleVolumeChange = e => {
    this.setState({ volume: parseFloat(e.target.value) });
  }

  handleProgress = state => {
    if (!this.state.seeking) {
      this.setState(state);
    }
  }

  handleSeekMouseDown = e => {
    this.setState({ seeking: true })
  }

  handleSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }

  handleSeekMouseUp = e => {
    this.setState({ seeking: false })
    this.player.seekTo(parseFloat(e.target.value))
  }

  handleEnded = () => {
    this.props.nextSong();
  }

  render() {
    const { url, playing, controls, volume, played, loaded} = this.state;

    return (
      <div>
        <ReactPlayer
          ref={player => { this.player = player }}
          className="react-player"
          url={url}
          playing={playing}
          controls={controls}
          volume={volume}
          width={0}
          height={0}
          onProgress={this.handleProgress}
          onEnded={this.handleEnded}
        />
        <div className="player-container">
          {/* {!playing && <button onClick={this.handlePlay}>Play</button>} */}
          <div onClick={this.props.prevSong} className="player-button">
            <img alt="alt" src={SkipSvg} className="icon"/>
          </div>
          {!playing &&
            <div onClick={this.handlePlay} className="player-button">
              <img alt="alt" src={PlaySvg} className="icon"/>
            </div>
          }
          {playing &&
            <div onClick={this.handlePause} className="player-button">
              <img alt="alt" src={PauseSvg} className="icon"/>
            </div>
          }
          <div onClick={this.props.nextSong} className="player-button">
            <img alt="alt" src={SkipSvg} className="icon"/>
          </div>
          {/* {playing && <button onClick={this.handlePause}>Pause</button>} */}
          <input type='range' min={0} max={1} step='any' value={volume} onChange={this.handleVolumeChange} />
          {/* <button onClick={this.handleStop}>Stop</button> */}
          <input
            type='range' min={0} max={0.999999} step='any'
            value={played}
            onMouseDown={this.handleSeekMouseDown}
            onChange={this.handleSeekChange}
            onMouseUp={this.handleSeekMouseUp}
          />
        </div>
      </div>
    );
  }
}