import React, { useEffect, useRef, useState } from "react";
import { YoutubePlayer } from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";
import { Player } from "./Player";
import { useSelector } from "react-redux";

export default function SongPlayer() {

  const playlist = useSelector(state => state.player.playlist);
  const songs = playlist.songs;

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const playOnLoad = useRef(true);
  const shuffle = useRef(false);

  useEffect(() => {
    setCurrentSongIndex(0);
    playOnLoad.current = true;
    shuffle.current = false;
  }, [playlist.id]);

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
          key={playlist.id.concat(currentSongIndex)}
          song={songs[currentSongIndex].link}
          name={songs[currentSongIndex].name}
          artist={songs[currentSongIndex].artist}
          image={songs[currentSongIndex].imageLink}
          prevSong={prevSong}
          nextSong={nextSong}
          randomSong={randomSong}
          playOnLoad={playOnLoad.current}
          shuffle={shuffle.current}
          isLastSong={currentSongIndex === songs.length - 1}
        />
      }
      {songs.length !== 0 && songs[currentSongIndex].type === "spotify" &&
        <SpotifyPlayer
          key={playlist.id.concat(currentSongIndex)}
          song={songs[currentSongIndex].link}
          name={songs[currentSongIndex].name}
          artist={songs[currentSongIndex].artist}
          image={songs[currentSongIndex].imageLink}
          prevSong={prevSong}
          nextSong={nextSong}
          randomSong={randomSong}
          playOnLoad={playOnLoad.current}
          shuffle={shuffle.current}
          isLastSong={currentSongIndex === songs.length - 1}
        />
      }
    </>
  );
}