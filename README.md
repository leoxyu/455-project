# Uni.fi

## Project Description

This project aims to create a music application for people who use multiple music services and do not want to switch apps, particularly targeting audiophiles. The app will support the following activities:

- Combining YouTube and Spotify playlists seamlessly
- Managing said playlists
- Offering users stats & analytics on their activities

The application will store the following types of data:

- Metadata for playlists and songs
- URLs/URIs
- User credentials

Users will be able to perform various actions with this data, including importing songs & playlists from Spotify and YouTube, creating custom playlists, sorting and searching songs, and accessing metadata for playlists, songs, and users.

## Project Task Requirements

### Minimal Requirements

1. Sign in 
   - Allow user to sign in/sign out
   - Develop functionality to fetch songs and playlists from the APIs
   - Store the imported data in the application's database

2. Creating custom playlists of songs
   - Design and implement a user-friendly interface for creating playlists
   - Allow users to add songs from the imported data or search for new songs
   - Enable saving and managing custom playlists

3. Playback
   - Be able to play songs inside the application
     
### Standard Requirements

1. Authentication & user login with OAuth
   - Implement OAuth authentication for users to log in with their Spotify or YouTube accounts
   - Store and manage user credentials securely
   - Enable personalized features and data retrieval based on user authentication

2. Direct song search from Spotify and YouTube using APIs
   - Integrate the Spotify and YouTube APIs to enable direct song searching
   - Provide search functionality within the application for users to find songs from both platforms

3. Allow importing playlists from YT or Spotify
   - Auto import from these services into our database
   - Search for these playlists and import into user's playlists
   
### Stretch Requirements

1. Applying machine learning models for tagging YouTube videos
   - Develop or integrate machine learning models to analyze YouTube videos and apply relevant tags to facilitate sorting and categorization

2. Support for other music streaming services
   - Investigate the possibility of integrating additional music streaming services such as Apple Music, allowing users to import and manage playlists from those services as well
  
3. Interact with other Uni.fi users
   - Implement the ability for users to like and follow playlists and other users
   - Track and display users' liked playlists and followed users

## Prototypes

A rough sketch prototype of the app UI can be found [here](./455_mock.png).

(Updated mar 26)

### html pages required:

## Basic features
### Login
Page for user to create/log in to 
- [UI]()
- [Backend]()
- 
### User login homepage
This is the page the user sees with the list of all songs and playlists
- [UI]()
- [Backend]()
- 
### Song list homepage
List of all songs a user has. Includes songs imported from playlists
- [UI]()
- [Backend]()
- 
### Playlist homepage
List of playlists
- [UI]()
- [Backend]()
- 
### Playlist page
UI for the playlist that contains the list of songs 
- [UI]()
- [Backend]()
- 
### Page to search and import new songs/playlists
Be able to add songs through search, or direct song/playlist link
- [UI]()
- [Backend]()


## community features
- search page for other users & playlists (use / commands to filter search results)
- page to view other user's profile


## UI feature suggestions:
- collapsing sidebar menu with options to switch between the different pages
(user home, search, songs, playlists)

