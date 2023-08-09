# Uni.fi

## Project Description

This project aims to create a music application for people who use multiple music services and do not want to switch applications when listending to music. It will allow users to import songs and playlists acroess nultiple services, and listen to them together seamlessly. 

## Project Details

The app will support the following activities:

- Combining YouTube and Spotify playlists seamlessly
- Managing said playlists
- Offering users stats & analytics on their activities

The application will store the following types of data:

- Metadata for playlists and songs
- URLs/URIs
- User credentials

## Project Task Requirements

### Minimal Requirements

1. Sign in 
- ✅ Allow user to sign in/sign out
- ✅ Develop functionality to fetch songs and playlists from the APIs
- ✅ Store the imported data in the application's database

2. Creating custom playlists of songs
- ✅ Design and implement a user-friendly interface for creating playlists
- ✅ Allow users to add songs from the imported data or search for new songs
- ✅ Enable saving and managing custom playlists

3. Playback
- ✅ Be able to play songs inside the application
     
### Standard Requirements

1. Authentication & user login with OAuth
- ✅ Implement OAuth authentication for users to log in with their Spotify or YouTube accounts
- ✅ Store and manage user credentials securely
- ✅ Enable personalized features and data retrieval based on user authentication

2. Direct song search from Spotify and YouTube using APIs
- ✅ Integrate the Spotify and YouTube APIs to enable direct song searching 
- ✅ Provide search functionality within the application for users to find songs from both platforms

3. Allow importing playlists from YT or Spotify
- ✅ Auto import from these services into our database
- ✅ Search for these playlists and import into user's playlists
   
### Stretch Requirements

1. Applying machine learning models for tagging YouTube videos
- ❌ Develop or integrate machine learning models to analyze YouTube videos and apply relevant tags to facilitate sorting and categorization

2. Support for other music streaming services
- ❌ Investigate the possibility of integrating additional music streaming services such as Apple Music, allowing users to import and manage playlists from those services as well
  
3. Interact with other Uni.fi users
- ❌ Implement the ability for users to like and follow playlists and other users
- ❌ Track and display users' liked playlists and followed users

### Tech Used
- HTML/CSS/JS
The entire project is in JS. We use CSS to heavily style our components, including responding to user interaction and maintaining a consistent visual theme across all our pages.
- React/Redux
The entire app is build with React. We have multiple reducers that handle many of the core functionality of our app, including the player, storing playlists, user credentials and the auth keys for Youtube and Spotify.
- Node/Express
All of our calls to the Youtube and Spotify APIs are implemented in our server, meaning that we have custom express APIs for almost all of the actions that can be performed in our app, including login, authentication, fetching playlists and search. 
- MongoDB
We use MongoDB to store all of our encrypted user data, as well as all the playlists across all users. We created unified schemas for our objects, like users, songs and playlists, and we implemented a schema validator in the database to make sure our data stays consistent.
- Render
Render was used to deploy our client and backend server. We configured an .env file in our server to store more sensitive data like the MongoDB token, so that it is not hard coded into the code.

### Above and Beyond
Due to the API limitates from both YouTube and Spotify, we needed a way to combat these issues in order to prevent being IP blocked from the services. We have multiple solutions implemented in order to solve this issue, including a bulk fetch for search, so that we are not calling the APIs for each item, and pagination when loading playlists in the front-end. We use lazy loading in order to improve the load times of our app, so that songs aren'y actually loaded until they are user-facing, or need to be played. 

### Next Steps
- Due do performance constraints of the react app, the original plan of organizing the songs in an interactive graph-like format was scrapped for a more traditional style. This could be revisited in the future.
- We can include more platforms like SoundCloud
- Set up a separate server to handle data related to recommendations, such as acousticness, loudness and genres. We would also set up a history module attached to the player, and using this and embedded models for the database, we can recommend songs to users based on the data. 
- Since we have all the users' playlists and songs stored, we can implement more social aspects to the app such as viewing other Uni.fi users' music, or following/

### Contributions
Leo<br>
I initially worked on setting up the user objects, including registering and logging in with a Uni.fi account. The credentials are encrypted and stored in our database, and is used to establish a link between users and playlists. I also implemented the song page, which calls all the songs from the imported playlists, and loads them into the UI. There are standard search/filter options for these. I also implemented the auto import from YouTube, which uses an intermediate component when you load into the application to prefetch data using the YouTube APIs. This data is then verified against the database for duplicates, and is saved as a playlist inside the user's Uni.fi account.

Alex<br>
I initially designed the UI and established a Spotify-inspired grid layout for the playlists page. Utilizing Redux Toolkit, I constructed the playlists and songs store, connecting it to async thunks that interfaced with a REST API. I enhanced the API with cursor pagination, filtering, and sorting, and addressed mongo schema inconsistencies by introducing a playlists collection validator. Additionally, I improved frontend performance by implementing lazy loading for songs and reducing unnecessary API requests.
  
Moses<br>
I researched and implemented the entire player component, including both the Youtube player and the Spotify player. I built and maintained most of the playlist editor and the options popup menu. I implemented the favouriting system and separated playlists between users. I also worked a lot on the UI, including the navbar and the song page.

Will<br>
I implemented all of the search page frontend components with their styling which includes the search bar, playlist divs, filter divs, initial options div, and song divs. I implemented all of the spotify and youtube search engine backend to include querying for playlists, songs, albums, their annotation with metadata, and paginated endpoints. Also heavily edited frontend to include lazy loading on demand of different data types, infinite scroll, previews of search queries, hover animations, integration with the playlist view when clicking on a playlist div, integration with playlist playing when clicking on the play button, active color changes, and svg assets.

David<br>
I worked on planning out the relationship structure of our react components, planning out and creating diagrams to assist in the design phase of the project. I added the OAuth verification flow for both Spotify and Youtube to allow users to access their respective APIs, as well as the token retrieval system. Lastly, I implemented the now playing page, and implemented lazy loading for adding & removing songs while a playlist is currently playing.


## Prototypes

A rough sketch prototype of the app UI can be found [here](./455_mock.png).
