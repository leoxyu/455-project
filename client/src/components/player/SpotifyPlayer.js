import React, { useState, useEffect, useRef } from "react";

export default function SpotifyPlayer(props) {
  const controller = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isStopped, setIsStopped] = useState(true);
  const [duration, setDuration] = useState(1.1);
  const [truePosition, setTruePosition] = useState(0);
  const [position, setPosition] = useState(0);
  const [seeking, setSeeking] = useState(false);

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
        const wrapper = document.getElementById('spotify-player');
        wrapper.appendChild(embed);
      }
      console.log("has iframe api");
      console.log(iframeApi);
      const element = document.getElementById('embed-iframe');
      console.log(element);
      const options = {
          width: 0,
          height: 0,
          // uri: "https://open.spotify.com/track/1MFpRGNHyNqOlwQO7zAayP?si=130eb2a425224216"
          uri: props.song
          };
      const callback = (EmbedController) => {
          controller.current = EmbedController;

          if (props.playOnLoad) {
          EmbedController.play();
          setIsStopped(false);
          setIsPlaying(true);
          }

          EmbedController.addListener('playback_update', e => {
          handleProgress(e.data);

          if (e.data.duration && e.data.position && e.data.duration === e.data.position) {
              props.callback();
          }
          });
      };
      iframeApi.createController(element, options, callback);
    }
  }, []);

  useEffect(() => {
    window.onSpotifyIframeApiReady = (IFrameAPI) => {
      console.log(IFrameAPI);
      console.log(window);
      const element = document.getElementById('embed-iframe');
      const options = {
          width: 0,
          height: 0,
          // uri: "https://open.spotify.com/track/1MFpRGNHyNqOlwQO7zAayP?si=130eb2a425224216"
          uri: props.song
        };
      const callback = (EmbedController) => {
        controller.current = EmbedController;

        if (props.playOnLoad) {
          EmbedController.play();
          setIsStopped(false);
          setIsPlaying(true);
        }

        EmbedController.addListener('playback_update', e => {
          handleProgress(e.data);

          if (e.data.duration && e.data.position && e.data.duration === e.data.position) {
            // handleStop();
            // setPosition(0);
            // setDuration(1.1);
            // EmbedController.loadUri('https://open.spotify.com/track/3M2BZA3QOwe9kdVPWkjJcX?si=002697998f4d4fc4');

            // console.log("destroy callback");
            // EmbedController.destroy();
            props.callback();
          }
        });
      };
      IFrameAPI.createController(element, options, callback);
    };
  }, []);

  useEffect(() => {
    if (!seeking) {
      setPosition(truePosition);
    }
  }, [truePosition]);

  const handleProgress = (data) => {
    setTruePosition(data.position);
    setDuration(data.duration);
  };

  const handlePlay = () => {
    if (isStopped) {
      controller.current.play();
      setIsStopped(false);
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
  }

  const handleSeekChange = (e) => {
    setPosition(parseInt(e.target.value));
  }

  const handleSeekMouseUp = (e) => {
    const seconds = parseInt(e.target.value / 1000, 10);

    // need this because for some reason sekking to 0 doesn't work
    if (seconds === 0) {
      controller.current.play();
      setTruePosition(0);
      setPosition(0);

      if (isStopped || !isPlaying) {
        controller.current.play();
      }

      setSeeking(false);
    } else {
      setSeeking(false);
      controller.current.seek(seconds);
    }
  }

  const handleStop = () => {
    if (isPlaying) {
      controller.current.togglePlay();
    }

    setIsPlaying(false);
    setIsStopped(true);
  };

  return (
    <div id="spotify-player">
      <div id="embed-iframe"></div>
      <input
        type='range' min={0} max={duration} step='any'
        value={position}
        onChange={handleSeekChange}
        onMouseDown={handleSeekMouseDown}
        onMouseUp={handleSeekMouseUp}
      />
      <button onClick={handlePlay}>Play</button>
      <button onClick={handlePause}>Pause</button>
      <input type='range' min={0} max={1} step='any' value={1} onChange={() => null} />
      <button onClick={handleStop}>Stop</button>
    </div>
  );
}