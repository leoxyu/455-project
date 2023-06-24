import React, { useRef, useState } from "react";
import { YoutubePlayer } from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";

// this isn't the actual component so don't use it. i just have it here as an example of how to use the 2 other components and once i don't need this anymore i'll remove it
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
  const shuffle = useRef(false);

  const nextSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }
    if (currentSongIndex < songs.length - 1) {
      setCurrentSongIndex(currentSongIndex + 1);
    }
    shuffle.current = false;
  };

  const prevSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }
    if (currentSongIndex > 0) {
      setCurrentSongIndex(currentSongIndex - 1);
    }
  };

  const randomSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }

    let index;

    do {
      index = Math.floor(Math.random() * songs.length);
    } while (index === currentSongIndex);

    setCurrentSongIndex(index);
    shuffle.current = true;
  };

  return (
    <>
      {songs[currentSongIndex].type === "youtube" &&
        <YoutubePlayer
          key={currentSongIndex}
          song={songs[currentSongIndex].link}
          prevSong={prevSong}
          nextSong={nextSong}
          randomSong={randomSong}
          playOnLoad={playOnLoad.current}
          shuffle={shuffle.current}
        />
      }
      {songs[currentSongIndex].type === "spotify" &&
        <SpotifyPlayer
          key={currentSongIndex}
          song={songs[currentSongIndex].link}
          prevSong={prevSong}
          nextSong={nextSong}
          randomSong={randomSong}
          playOnLoad={playOnLoad.current}
          shuffle={shuffle.current}
        />
      }
    </>
  );
}