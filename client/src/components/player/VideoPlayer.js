import React, { useRef, useState } from "react";
import { YoutubePlayer } from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";
import '../../styles/VideoPlayer.css';

export default function GeneralPlayer() {
  const songs = [
    {
      link: "https://www.youtube.com/watch?v=8SPtkjMUkGk",
      type: "youtube"
    },
    {
      link: "https://open.spotify.com/track/1MFpRGNHyNqOlwQO7zAayP?si=130eb2a425224216",
      type: "spotify"
    },
    {
      link: "https://www.youtube.com/watch?v=jPoqpNmf8DM",
      type: "youtube"
    },
    {
      link: "https://open.spotify.com/track/3M2BZA3QOwe9kdVPWkjJcX?si=002697998f4d4fc4",
      type: "spotify"
    },
    {
      link: "https://open.spotify.com/track/1MFpRGNHyNqOlwQO7zAayP?si=130eb2a425224216",
      type: "spotify"
    },
    {
      link: "https://www.youtube.com/watch?v=8SPtkjMUkGk",
      type: "youtube"
    },
    {
      link: "https://www.youtube.com/watch?v=jPoqpNmf8DM",
      type: "youtube"
    },
  ];

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const playOnLoad = useRef(false);

  const nextSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }
    if (currentSongIndex < songs.length - 2) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
  };

  const prevSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  return (
    <>
      {songs[currentSongIndex].type === "youtube" &&
        <YoutubePlayer
          song={songs[currentSongIndex].link}
          prevSong={prevSong}
          nextSong={nextSong}
          playOnLoad={playOnLoad.current}
        />
      }
      {songs[currentSongIndex].type === "spotify" &&
        <SpotifyPlayer
          song={songs[currentSongIndex].link}
          callback={nextSong}
          playOnLoad={playOnLoad.current}
        />
      }
      {/* <button onClick={prevSong}>Prev</button>
      <button onClick={nextSong}>Next</button> */}
    </>
  );
}