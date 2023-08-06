import React, { useEffect, useState } from 'react';
import { Link, useLocation} from 'react-router-dom';
import '../../styles/variables.css';
import '../../styles/NavBar.css';
import {ReactComponent as HomeIcon} from '../../images/home.svg';
import {ReactComponent as SearchIcon} from '../../images/search_nav.svg';
import {ReactComponent as PlaylistIcon} from '../../images/current_playlist.svg';
import {ReactComponent as LibraryIcon} from '../../images/library.svg';
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

    // Get the current location object using useLocation hook
    const location = useLocation();

    // Function to determine if a link should be considered active
    const isLinkActive = (pathname) => {
        return location.pathname === pathname;
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
                    <div className={`nav-link ${isLinkActive('/home') ? 'active' : ''}`}>
                        <Link to="/home">
                            <HomeIcon className='home-nav-icon' alt='Home'></HomeIcon>
                            <span className='nav-text'>Home</span>
                        </Link>
                    </div>
                    <div className={`nav-link ${isLinkActive('/search') ? 'active' : ''}`}>
                        <Link to="/search">
                            <SearchIcon className='search-nav-icon' alt='Search'></SearchIcon>
                            <span className='nav-text'>Search</span>
                        </Link>
                    </div>
                    <div className={`nav-link ${isLinkActive('/library') ? 'active' : ''}`}>
                        <Link to="/library">
                        
                            <LibraryIcon className='library-nav-icon'></LibraryIcon>
                            <span className='nav-text'>Library</span>
                        </Link>
                    </div>
                    {currentPlaylistId !== '' && 
                    <div className={`nav-link ${isLinkActive(`/playlists/${currentPlaylistId}`) ? 'active' : ''}`}>
                        <Link to={`/playlists/${currentPlaylistId}`}>
                            
                            <PlaylistIcon className='playlist-nav-icon'></PlaylistIcon>
                            <span className='nav-text'>Playing</span>
                        </Link>
                    </div>
                    }
            </div>
            <div className='nav-link'>
                <div className="navbar-bottom">
                    <SignOutIcon className="signout-nav-icon" alt="Sign Out" onClick={handleSignOut}> Log Out</SignOutIcon>
                    Log Out
                </div>
            </div>
        </nav>
    );
};

export default Navbar;