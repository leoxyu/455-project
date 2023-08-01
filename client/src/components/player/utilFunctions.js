function removeTracksFromPlaylist(playlist, toBeRemoved) {
    return playlist.filter((song) => !toBeRemoved.some((toBeRemovedSong) => toBeRemovedSong.songID === song.songID));
}

