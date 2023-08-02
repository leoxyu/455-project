import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from 'react-redux';

import { YoutubePlayer } from "./YoutubePlayer";
import SpotifyPlayer from "./SpotifyPlayer";
import { Player } from "./Player";

import { setCurrSongIdPlaylistPage, setPlaylistPlaylistPage } from "../../pages/current playlist/redux/currentPlaylistReducer";
import { lazyLoadClearCache, lazyLoadUpdatePlaylist } from "./PlayerReducer";

const { PREV_TRACK, NEXT_TRACK, USER_SELECTION } = require("./constants.js");


export default function SongPlayer() {

  const dispatch = useDispatch();

  const playlist = useSelector(state => state.player.playlist);
  const currSongID = useSelector(state => state.player.currSongID);
  const songs = playlist.songs;

  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const playOnLoad = useRef(true);
  const shuffle = useRef(false);

  useEffect(() => {
    if (songs && songs.length > 0 && currSongID) {
      console.log("currSong changed, playing song");
      const action = {
        "isShuffleOn": shuffle,
        "operation": USER_SELECTION,
      };
      dispatch(lazyLoadUpdatePlaylist(action)); // updates currSongID
      setCurrentSongIndex(songs.findIndex(song => song.songID === currSongID));
      dispatch(setCurrSongIdPlaylistPage(currSongID));
      playOnLoad.current = true;
    }
  }, [currSongID]);

  useEffect(() => {
    console.log("playlist id changed, playing song");
    setCurrentSongIndex(0);
    dispatch(lazyLoadClearCache());
    if (songs && songs.length > 0) {
      console.log("currSong changed due to user selection");
      dispatch(setCurrSongIdPlaylistPage(songs[0].songID));
      dispatch(setPlaylistPlaylistPage(playlist));
    }
    playOnLoad.current = true;
    shuffle.current = false;
  }, [playlist.id]);

  const nextSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }
    // if (currentSongIndex < songs.length - 1) {
    // dispatch(setCurrSongIdPlaylistPage(songs[currentSongIndex + 1].songID));
    // setCurrentSongIndex(currentSongIndex + 1);
    // }
    const action = {
      "isShuffleOn": shuffle,
      "operation": NEXT_TRACK,
    };
    dispatch(lazyLoadUpdatePlaylist(action)); // updates the currSongID
    const newIndex = songs.findIndex(song => song.songID === currSongID);
    setCurrentSongIndex(newIndex);
    dispatch(setCurrSongIdPlaylistPage(newIndex));

    shuffle.current = false;
  };

  const prevSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }
    // if (currentSongIndex > 0) {
    //   dispatch(setCurrSongIdPlaylistPage(songs[currentSongIndex - 1].songID));
    //   setCurrentSongIndex(currentSongIndex - 1);
    // }

    const action = {
      "isShuffleOn": shuffle,
      "operation": PREV_TRACK,
    };
    dispatch(lazyLoadUpdatePlaylist(action)); // updates the currSongID
    const newIndex = songs.findIndex(song => song.songID === currSongID);
    setCurrentSongIndex(newIndex);
    dispatch(setCurrSongIdPlaylistPage(newIndex));
  };

  const randomSong = () => {
    if (!playOnLoad.current) {
      playOnLoad.current = true;
    }

    // let index;

    // do {
    //   index = Math.floor(Math.random() * songs.length);
    // } while (index === currentSongIndex);

    // dispatch(setCurrSongIdPlaylistPage(songs[index].songID));
    // setCurrentSongIndex(index);
    shuffle.current = true;

    const action = {
      "isShuffleOn": shuffle,
      "operation": NEXT_TRACK,
    };
    dispatch(lazyLoadUpdatePlaylist(action)); // updates the currSongID
    const newIndex = songs.findIndex(song => song.songID === currSongID);
    setCurrentSongIndex(newIndex);
    dispatch(setCurrSongIdPlaylistPage(newIndex));

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