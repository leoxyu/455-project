import React from 'react';
import ReactPlayer from 'react-player';
import { Player } from './Player';

export class YoutubePlayer extends React.Component {
  state = {
    url: this.props.song,
    playing: this.props.playOnLoad,
    controls: false,
    volume: 1,
    played: 0,
    loop: false
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

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop })
  }

  handleEnded = () => {
    this.props.nextSong();
  }

  render() {
    const { url, playing, controls, volume, played, loop} = this.state;

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
          loop={loop}
        />
        <Player
          playing={playing}
          played={played}
          loop={loop}
          volume={volume}
          onPrev={this.props.prevSong}
          onNext={this.props.nextSong}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onLoop={this.handleToggleLoop}
          onSeekMouseDown={this.handleSeekMouseDown}
          onSeekMouseUp={this.handleSeekMouseUp}
          onSeekChange={this.handleSeekChange}
          onVolumeChange={this.handleVolumeChange}
          type="youtube"
        />
      </div>
    );
  }
}