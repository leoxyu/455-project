import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './styles/playlistPage.css';
import PlaylistContainer from "./components/playlistContainer.js";
import { useLazyLoadSongs } from '../../util';
import { TYPE_ALBUM, TYPE_PLAYLIST, TYPE_SPOTIFY, TYPE_YOUTUBE } from '../../typeConstants';

const CurrentPlaylistPage = () => {
    const { id} = useParams();

    // this is needed for current playlist page for single song
    var foundPlaylist = useSelector(state => state.playlists.playlists.find(p => id === p.playlistID));

    // this is so awful, but it's the only way with this much time 
    const foundYoutubePlaylist = useSelector(state => state.search.youtube.playlists.find(p => id === p.originId));
    const foundSpotifyPlaylist = useSelector(state => state.search.spotify.playlists.find(p => id === p.originId));
    const foundSpotifyAlbum = useSelector(state => state.search.spotify.albums.find(p => id === p.originId));

    const currentlyPlaying = useSelector(state => state.player.playlist);
    let type = null;
    let source = null;

    let playlist = {};
    if (!foundPlaylist && !foundYoutubePlaylist && !foundSpotifyPlaylist && !foundSpotifyAlbum) {
        playlist = currentlyPlaying;
    } else {
        if (foundYoutubePlaylist) {
            type = TYPE_PLAYLIST;
            source = TYPE_YOUTUBE;
            
            foundPlaylist = foundYoutubePlaylist;
        } else if (foundSpotifyPlaylist) {
            type = TYPE_PLAYLIST;
            source = TYPE_SPOTIFY;
            foundPlaylist= foundSpotifyPlaylist;
        } else if (foundSpotifyAlbum) {
            type = TYPE_ALBUM;
            source = TYPE_SPOTIFY;
            foundPlaylist= foundSpotifyAlbum;
        } 

        playlist = {
            id: foundPlaylist.playlistID ?? foundPlaylist.originId,
            playlistName: foundPlaylist.name,
            thumbnailUrl: foundPlaylist.coverImageURL,
            releaseDate: foundPlaylist.dateCreated,
            duration: foundPlaylist.songs.length,
            artistName: foundPlaylist.author,
            isFavorited: foundPlaylist.isFavorited,
            source: foundPlaylist.source,
            type: foundPlaylist.type,
            description: foundPlaylist.description,
            songs: (typeof(foundPlaylist.songs) === 'string')? []:foundPlaylist.songs,
        };
        
    }
    console.log(playlist.id, id);
    const loading = useLazyLoadSongs(playlist, (playlist.id)? playlist.id: id, type, source);
    return (
        <div>
            <PlaylistContainer
                {...playlist}
                loading={loading}
            />
        </div>
    );
}


export default CurrentPlaylistPage;