import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/NavBar.css';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../pages/login/redux/loginReducer';

const defaultProfilePicture = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg';

const Navbar = () => {
    const [dynamicProfilePicture, setDynamicProfilePicture] = useState(null);
    const userId = useSelector((state) => state.login.id);
    const spotifyProfile = useSelector((state) => state.spotify.profile);

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
                    <h1 className="username">{userId}</h1>
                </div>
            </div>

            <ul className="navbar-menu">
                <h1>
                    <Link to="/home">Home</Link>
                </h1>
                <h1>
                    <Link to="/songs">Songs</Link>
                </h1>
                <h1>
                    <Link to="/currentPlaylist">Playlist</Link>
                </h1>
                <h1>
                    <Link to="/playlists">Playlists</Link>
                </h1>
                <h1>
                    <Link to="/search">Search</Link>
                </h1>
            </ul>

            <div className="navbar-bottom">
                <button className="signout-button" onClick={handleSignOut}>
                    Sign Out
                </button>
            </div>
        </nav>
    );
};

export default Navbar;