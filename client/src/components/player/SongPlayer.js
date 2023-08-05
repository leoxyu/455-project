import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { YoutubePlayer } from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";
import { Player } from "./Player";

import { setCurrSongIdPlaylistPage } from "../../pages/current playlist/redux/currentPlaylistReducer";

export default function SongPlayer() {

  const dispatch = useDispatch();

  const playlist = useSelector(state => state.player.playlist);
  const startFromTop = useSelector(state => state.player.startFromTop);
  const currSongID = useSelector(state => state.player.currSongID);
  const songs = playlist.songs;

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const playOnLoad = useRef(true);
  const shuffle = useRef(false);

  useEffect(() => {
    if (songs && songs.length > 0) {
      console.log("currSong changed, playing song");
      setCurrentSongIndex(songs.findIndex(song => song.songID === currSongID));
      playOnLoad.current = true;
    }
  }, [currSongID]);

  useEffect(() => {
    if (startFromTop) {
      console.log("playlist id changed, playing song");
      setCurrentSongIndex(0);
      if (songs && songs.length > 0) dispatch(setCurrSongIdPlaylistPage(songs[0].songID));
      playOnLoad.current = true;
      shuffle.current = false;
    }
  }, [playlist.id]);

  const nextSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }
    if (currentSongIndex < songs.length - 1) {
      dispatch(setCurrSongIdPlaylistPage(songs[currentSongIndex + 1].songID));
      setCurrentSongIndex(currentSongIndex + 1);

    }
    shuffle.current = false;
  };

  const prevSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }
    if (currentSongIndex > 0) {
      dispatch(setCurrSongIdPlaylistPage(songs[currentSongIndex - 1].songID));
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

    dispatch(setCurrSongIdPlaylistPage(songs[index].songID));
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
      {songs.length !== 0 && songs[currentSongIndex]?.source === "youtube" &&
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
      {songs.length !== 0 && songs[currentSongIndex]?.source === "spotify" &&
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