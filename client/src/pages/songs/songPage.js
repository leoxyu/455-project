import '../../styles/variables.css';
import SearchBar from '../search/components/SearchBar';
import Filters from '../search/components/Filters';
import '../search/styles/Preview.css';
import '../../styles/SongPage.css';
import SongResult from '../search/components/SongResult';
import { useSelector } from 'react-redux';
import '../../styles/variables.css';
import '../../styles/searchPage.css';
import { useEffect } from 'react';

const SongPage = () => {
    const playlists = useSelector(state => state.playlists.playlists);
    const allSongs = playlists.flatMap(playlist => playlist.songs);

    useEffect(() => {
        // Generate random positions for the songs
        const songs = document.querySelectorAll('.spotify-preview');
        songs.forEach(star => {
            const { width, height } = star.parentElement.getBoundingClientRect();
            const x = Math.floor(Math.random() * width);
            const y = Math.floor(Math.random() * height);
            star.style.left = `${x}px`;
            star.style.top = `${y}px`;
        });
    }, []);

    return (
        <div className='songs-page'>

            <SearchBar placeholder='Search for song' />
            <Filters filters={['All', 'Uni.fi', 'Spotify', 'YouTube']} />

            <h2 className='songs-heading'>Your Songs</h2>
            <div className='spotify-songs' style={{ display: 'flex', 'flex-wrap': 'wrap' }}>
                {allSongs.map((song) => (
                    <SongResult
                        className='spotify-preview'
                        key={song.songLink}
                        thumbnailUrl={song.imageLink}
                        songName={song.name}
                        artists={song.artist}
                        duration={song.duration}
                        songLink={song.songLink}
                        platform='Spotify'
                        songObject={song}
                    />
                ))}
            </div>
        </div>
    );
};



export default SongPage;
