import React, { useRef, useState } from "react";
import { YoutubePlayer } from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";
import { Player } from "./Player";

export default function SongPlayer() {
  const songs = [
    {
      link: "https://open.spotify.com/track/4Anip7bDkwKk4HacAIwvEl",
      type: "spotify"
    },
    {
      link: "https://open.spotify.com/track/0NksLiIx5lbWzFTYTCx4z7",
      type: "spotify"
    },
    {
      link: "https://www.youtube.com/watch?v=HMGetv40FkI",
      type: "youtube"
    },
    {
      link: "https://www.youtube.com/watch?v=CjUVTEExfBg",
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
      {songs.length === 0 &&
        <Player
          playing={false}
          played={0}
          loop={false}
          shuffle={false}
          volume={1}
          muted={false}
          onPrev={() => null}
          onNext={() => null}
          onPlay={() => null}
          onPause={() => null}
          onToggleLoop={() => null}
          onToggleShuffle={() => null}
          onSeekMouseDown={() => null}
          onSeekMouseUp={() => null}
          onSeekChange={() => null}
          onVolumeChange={() => null}
          onToggleMute={() => null}
          type="none"
        />
      }
      {songs.length !== 0 && songs[currentSongIndex].type === "youtube" &&
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
      {songs.length !== 0 && songs[currentSongIndex].type === "spotify" &&
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