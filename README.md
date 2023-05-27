# 455-project

## Project Description

This project aims to create a music application for people who use multiple music services and do not want to switch apps, particularly targeting audiophiles. The app will support the following human activities:

- Following & liking user-created playlists
- Combining YouTube and Spotify playlists seamlessly
- Managing playlists
- Offering users stats & analytics on their activities

The application will store the following types of data:

- Metadata for playlists and songs
- URLs/URIs
- User credentials

Users will be able to perform various actions with this data, including importing songs & playlists from Spotify and YouTube, creating custom playlists, sorting and searching songs, and accessing metadata for playlists, songs, and users.

## Additional Functionality

Based on time constraints, additional functionality that can be considered includes:

- Authentication & user login using OAuth
- Direct song search from Spotify and YouTube using their respective APIs
- Likes and follows functionality
- Integration with other music streaming services like Apple Music
- Building Spotify profile features and providing stat pages
- Applying machine learning models for tasks such as sentiment analysis, hashtag analysis, artist recommendations, etc.
- Support for offline listening (looking into ethics)

## Project Task Requirements

### Minimal Requirements

1. Importing songs & playlists from Spotify and YouTube
   - Implement authentication with Spotify and YouTube APIs
   - Develop functionality to fetch songs and playlists from the APIs
   - Store the imported data in the application's database

2. Creating custom playlists of songs
   - Design and implement a user-friendly interface for creating playlists
   - Allow users to add songs from the imported data or search for new songs
   - Enable saving and managing custom playlists

### Standard Requirements

1. Authentication & user login with OAuth
   - Implement OAuth authentication for users to log in with their Spotify or YouTube accounts
   - Store and manage user credentials securely
   - Enable personalized features and data retrieval based on user authentication

2. Direct song search from Spotify and YouTube using APIs
   - Integrate the Spotify and YouTube APIs to enable direct song searching
   - Provide search functionality within the application for users to find songs from both platforms

3. Likes and follows functionality
   - Implement the ability for users to like and follow playlists and other users
   - Track and display users' liked playlists and followed users

### Stretch Requirements

1. Integration with YouTube and Spotify APIs for additional features
   - Leverage the YouTube API's search functionality for integrated song searching
   - Explore the Spotify API's capabilities for building features such as Spotify Connected App, Spotify Profile, or analysis of Spotify's top tracks

2. Applying machine learning models for tagging YouTube videos
   - Develop or integrate machine learning models to analyze YouTube videos and apply relevant tags to facilitate sorting and categorization

3. Support for other music streaming services
   - Investigate the possibility of integrating additional music streaming services such as Apple Music, allowing users to import and manage playlists from those services as well

## Prototypes

A rough sketch prototype of the app UI can be found [here](./455_mock.png).

(Updated mar 26)

### html pages required:

## basic features
- login
- user login homepage (+ list of playlists, including own and saved playlists) (+ list of friends)
  (+ login feed with playlist suggestions)
- playlist homepage
- song list homepage
- page to search and import new songs

## community features
- search page for other users & playlists (use / commands to filter search results)
- page to view other user's profile


## UI feature suggestions:
- collapsing sidebar menu with options to switch between the different pages
(user home, search, songs, playlists)

