import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/NavBar.css';
import {ReactComponent as HomeIcon} from '../../images/home.svg';
import {ReactComponent as SearchIcon} from '../../images/search_nav.svg';
import {ReactComponent as PlaylistIcon} from '../../images/current_playlist.svg';
import {ReactComponent as PlaylistsIcon} from '../../images/playlists.svg';
import {ReactComponent as SignOutIcon} from '../../images/sign_out.svg';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../pages/login/redux/loginReducer';

const defaultProfilePicture = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg';

const Navbar = () => {
    const [dynamicProfilePicture, setDynamicProfilePicture] = useState(null);
    const userId = useSelector((state) => state.login.id);
    const spotifyProfile = useSelector((state) => state.spotify.profile);
    const currentPlaylistId = useSelector((state) => state.player.playlist.id);

    useEffect(() => {
        try {
            if (spotifyProfile && spotifyProfile.images.length > 0) {
                const lastImage = spotifyProfile.images.slice(-1)[0];
                setDynamicProfilePicture(lastImage.url);
            }
        } catch {
            console.log('Issue with setting custom profile picture. Please try again later.')
        }

    }, [spotifyProfile]);

    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar">
            <div className="navbar-top">
                <div className="user-profile">
                    <img className="profile-picture" src={dynamicProfilePicture || defaultProfilePicture} alt="Profile" />
                    {/* <h1 className="username">{userId}</h1> */}
                </div>
            </div>

            <div className="navbar-menu">
                    <Link to="/home">
                        <HomeIcon className='home-icon' alt='Home'></HomeIcon>
                        <div>Home</div>
                    </Link>
                    <Link to="/search">
                        <SearchIcon className='search-icon' alt='Search'></SearchIcon>
                        <div>Search</div>
                    </Link>
                    <Link to="/playlists">
                        <PlaylistsIcon className='playlists-icon'></PlaylistsIcon>
                        <div>Library</div>
                    </Link>
                    {currentPlaylistId !== '' && 
                    <Link to={`/playlists/${currentPlaylistId}`}>
                        <PlaylistIcon className='playlist-icon'></PlaylistIcon>
                        <div>Playing</div>
                    </Link>
                    }
            </div>

            <div className="navbar-bottom">
                <div>
                <SignOutIcon className="signout-icon" alt="Sign Out" onClick={handleSignOut}> Log Out</SignOutIcon>
                <div>Log Out</div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;