import React from 'react';
import ReactPlayer from 'react-player';
import { Player } from './Player';

export class YoutubePlayer extends React.Component {
  state = {
    url: this.props.song,
    playing: this.props.playOnLoad,
    controls: false,
    volume: 1,
    muted: false,
    played: 0,
    loop: false,
    shuffle: this.props.shuffle,
    justEnded: false
  }

  load = url => {
    this.setState({
      url,
      played: 0,
    });
  }

  handlePlay = () => {
    if (this.state.justEnded) {
      this.player.seekTo(0);
    }

    this.setState({ playing: true, justEnded: false });
  }

  handlePause = () => {
    this.setState({ playing: false });
  }

  handleVolumeChange = e => {
    this.setState({ volume: parseFloat(e.target.value), muted: false });
  }

  handleToggleMute = () => {
    if (this.state.volume === 0) {
      this.setState({ volume: 0.999, muted: false });
    } else if (this.state.muted) {
      this.setState({ muted: false });
    } else {
      this.setState({ muted: true });
    }
  }

  handleProgress = state => {
    if (!this.state.seeking && !this.state.justEnded) {
      this.setState(state);
    }
  }

  handleSeekMouseDown = e => {
    this.setState({ seeking: true });
  }

  handleSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) });
  }

  handleSeekMouseUp = e => {
    this.setState({ seeking: false });
    this.player.seekTo(parseFloat(e.target.value));
  }

  handleToggleLoop = () => {
    this.setState({ loop: !this.state.loop });
  }

  handleToggleShuffle = () => {
    this.setState({ shuffle: !this.state.shuffle });
  };

  handleEnded = () => {
    if (this.props.isLastSong) {
      this.setState({ playing: false, played: 0, justEnded: true });
    } else {
      this.handleNextSong();
    }
  }

  handleNextSong = () => {
    if (this.state.shuffle) {
      this.props.randomSong();
    } else {
      this.props.nextSong();
    }
  };

  render() {
    const { url, playing, controls, volume, muted, played, loop, shuffle} = this.state;

    return (
      <div  className="song-player">
        <ReactPlayer
          ref={player => { this.player = player }}
          className="react-player"
          url={url}
          playing={playing}
          controls={controls}
          volume={volume}
          muted={muted}
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
          shuffle={shuffle}
          volume={volume}
          muted={muted}
          onPrev={this.props.prevSong}
          onNext={this.handleNextSong}
          onPlay={this.handlePlay}
          onPause={this.handlePause}
          onToggleLoop={this.handleToggleLoop}
          onToggleShuffle={this.handleToggleShuffle}
          onSeekMouseDown={this.handleSeekMouseDown}
          onSeekMouseUp={this.handleSeekMouseUp}
          onSeekChange={this.handleSeekChange}
          onVolumeChange={this.handleVolumeChange}
          onToggleMute={this.handleToggleMute}
          type="youtube"
        />
      </div>
    );
  }
}