import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/NavBar.css';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { logout } from '../../pages/login/redux/loginReducer'

const defaultProfilePicture = 'https://soccerpointeclaire.com/wp-content/uploads/2021/06/default-profile-pic-e1513291410505.jpg';

const Navbar = () => {
    const userId = useSelector(state => state.login.id);
    const dispatch = useDispatch();

    const handleSignOut = () => {
        dispatch(logout());
    };

    return (
        <nav className="navbar">
            <div className="navbar-top">
                <div className="user-profile">
                    <img className="profile-picture" src={defaultProfilePicture} alt="Profile" />
                    <h1 className="username">{userId}</h1>
                </div>
            </div>

            <ul className="navbar-menu">
                <h1>
                    <Link to="/home">Home</Link>
                </h1>
                <h1>
                    <Link to="/currentPlaylist">Current Playlist</Link>
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