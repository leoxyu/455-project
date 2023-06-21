import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/HomePage.css'; // Create a new CSS file for homepage styles

const HomePage = () => {
  const theme = useSelector(state => state.theme); // Assuming you have a theme state in Redux
  const userId = useSelector(state => state.id);
  let signedIn = userId;

  return (
    <div className={`App-header ${theme}`}>
      <h1 className="website-header1">THIS IS THE HOME PAGE</h1>
      <Link to="/search" className="App-link">Go to Search Page</Link>
      {signedIn && (
        <h1>Signed in as {userId}</h1>
      )}
    </div>
  );
}

export default HomePage;