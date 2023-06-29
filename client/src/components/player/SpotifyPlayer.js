/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from "react";
import { Player } from "./Player";

export default function SpotifyPlayer(props) {
  const controller = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(1.1);
  const [truePosition, setTruePosition] = useState(0);
  const [position, setPosition] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [loop, setLoop] = useState(false);
  const [shuffle, setShuffle] = useState(props.shuffle);

  const iframeApi = window.SpotifyIframeApi;

  useEffect(() => {
    const script = document.createElement('script');

    script.src = "https://open.spotify.com/embed-podcast/iframe-api/v1";
    script.async = true;

    document.body.appendChild(script);

    return () => {
      controller.current?.destroy();
      document.body.removeChild(script);
    }
  }, []);

  useEffect(() => {
    if (iframeApi) {
      // this is because react strict mode renders stuff twice which for whatever reason cases embed-iframe element to disappear
      if (controller.current) {
        const embed = document.createElement('div');
        embed.setAttribute("id", "embed-iframe");
        const container = document.getElementById('iframe-container');
        container.appendChild(embed);
      }

      initializeIframe(iframeApi);
    }
  }, []);

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      initializeIframe(IFrameAPI);
    };
  }, []);

  useEffect(() => {
    if (!seeking) {
      setPosition(truePosition);
    }

    if (truePosition === duration) {
      handleEnded();
    }
  }, [truePosition]);

  const initializeIframe = (IFrameAPI) => {
    const element = document.getElementById('embed-iframe');
      const options = {
          width: 0,
          height: 0,
          uri: props.song
        };
      const callback = (EmbedController) => {
        controller.current = EmbedController;

        if (props.playOnLoad) {
          EmbedController.play();
          setIsPlaying(true);
        }

        EmbedController.addListener('playback_update', e => {
          handleProgress(e.data);
        });
      };
      IFrameAPI.createController(element, options, callback);
  };

  const handleProgress = (data) => {
    setTruePosition(data.position);
    setDuration(data.duration);
  };

  const handlePlay = () => {
    if (truePosition === 0) {
      controller.current.play();
    } else if (!isPlaying) {
      controller.current.togglePlay();
    }

    setIsPlaying(true);
  };

  const handlePause = () => {
    if (isPlaying) {
      controller.current.togglePlay();
      setIsPlaying(false);
    }
  };

  const handleSeekMouseDown = () => {
    setSeeking(true);
  };

  const handleSeekChange = (e) => {
    setPosition(parseInt(e.target.value));
  };

  const handleSeekMouseUp = (e) => {
    const seconds = parseInt(e.target.value / 1000, 10);

    // need this because for some reason seeking to 0 doesn't work
    if (seconds === 0) {
      setTruePosition(0);
      setPosition(0);

      if (isPlaying) {
        controller.current.play();
      }

      setSeeking(false);
    } else {
      setSeeking(false);
      controller.current.seek(seconds);
    }
  };

  const toggleLoop = () => {
    setLoop(!loop);
  };

  const toggleShuffle = () => {
    setShuffle(!shuffle);
  };

  const handleNextSong = () => {
    if (shuffle) {
      props.randomSong();
    } else {
      props.nextSong();
    }
  };

  const handleEnded = () => {
    if (loop) {
      controller.current.play();
      setTruePosition(0);
      setPosition(0);
      setIsPlaying(true);
    } else if (props.isLastSong) {
      setTruePosition(0);
      setPosition(0);
      setIsPlaying(false);
    } else {
      handleNextSong();
    }
  };

  return (
    <div id="spotify-player" className="song-player">
      <div className="iframe-container" id="iframe-container">
        <div id="embed-iframe"></div>
      </div>
      <Player
        name={props.name}
        artist={props.artist}
        image={props.image}
        playing={isPlaying}
        played={position}
        loop={loop}
        shuffle={shuffle}
        volume={1}
        muted={false}
        onPrev={props.prevSong}
        onNext={handleNextSong}
        onPlay={handlePlay}
        onPause={handlePause}
        onToggleLoop={toggleLoop}
        onToggleShuffle={toggleShuffle}
        onSeekMouseDown={handleSeekMouseDown}
        onSeekMouseUp={handleSeekMouseUp}
        onSeekChange={handleSeekChange}
        onVolumeChange={() => null}
        onToggleMute={() => null}
        type="spotify"
        duration={duration}
      />
    </div>
  );
}