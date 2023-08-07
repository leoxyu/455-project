import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import './styles/playlistPage.css';
import PlaylistContainer from "./components/playlistContainer.js";
import { useLazyLoadSongs } from '../../util';

const CurrentPlaylistPage = () => {
    const { id } = useParams();

    // this is needed for current playlist page for single song
    const foundPlaylist = useSelector(state => state.playlists.playlists.find(p => id === p.playlistID));
    const currentlyPlaying = useSelector(state => state.player.playlist);
    let playlist;
    if (!foundPlaylist) {
        playlist = currentlyPlaying;
    } else {
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
            songs: foundPlaylist.songs,
        };
    }
    const loading = useLazyLoadSongs(playlist, playlist.id);
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