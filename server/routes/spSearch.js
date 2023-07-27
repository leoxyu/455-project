var express = require('express');
const { v4: uuid } = require('uuid');

const {TYPE_ALBUM, TYPE_PLAYLIST, TYPE_SPOTIFY} = require("../shared/playlistTypeConstants");

var spotifySearchRouter = express.Router();





function formatDuration(milliseconds) {
    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
  
    const formattedHours = hours > 0 ? String(hours) : '';
    const formattedMinutes = minutes > 0 ? String(minutes % 60): '0';
    const formattedSeconds = String(seconds % 60);
  
    const parts = [];
    if (formattedHours !== '') {
      parts.push(formattedHours);
    }
    parts.push(formattedMinutes);
    parts.push(formattedSeconds.padStart(2, '0'));
  
    return parts.join(':');
}
  
  


// thumbnailUrl, songName,
//  artistName, views, duration,
//  songLink, platform,
function parseSpotifyTracks(items, thumbnailUrl=false, release_date=false, popularity=false, album=false) {
    return items.map(track => {
        return {
            'songID': track.id, 
            'artist': track.artists.join(', '),
            'name': track.name,
            'type': 'spotify',
            'link': `spotify:track:${track.id}`, // TODO: look at main
            'imageLink': (thumbnailUrl)? thumbnailUrl : track.album.images[0].url,
            'album': (album)? album: track.album.name, 
            'duration': formatDuration(track.duration_ms),
            'releaseDate': (release_date)? release_date: track.album.release_date,

            // extra
            'views': (popularity)? popularity: track.popularity, // TODO: change to popularity
            'genres': track.genresConcat, //and union with artist genre
            'audioFeatures': track.audioFeatures,
            
            
        };
});
}


function parseSpotifyAlbums(items) {
    return items.map(album => {
        return {
            // uuid: not created yet
            'dateCreated': album.release_date,
            'description':null, // none for spotify
            'name': album.name,
            'author': album.artists.join(', '),
            'isFavorited': false,
            'coverImageURL': album.images[0].url,
            'songs': parseSpotifyTracks(album.tracks.items,
                album.images[0].url,
                album.release_date,
                album.popularity,
                album.name),
            'originId': album.id,
            'isAlbum': true,
            
            //extra
            'genres': album.genresConcat, //and union with artist genre
            'duration': album.total_tracks, // convert to min
            // 'playlistLink': album.href,
            'tracksNextLink': album.tracks.next,
            'popularity': album.popularity,
            'uri': album.uri,
            'type': 'spotify',
        };
});
}


//'https://api.spotify.com/v1/audio-features?ids=4bjN59DRXFRxBE1g5ne6B1%2C0SOnbGVEf5q0YqL0FO2qu0%2C4mEcvV7O3fibI38H2MfHuJ' \
//'https://api.spotify.com/v1/audio-features?ids=4bjN59DRXFRxBE1g5ne6B1%2C0SOnbGVEf5q0YqL0FO2qu0%2C4mEcvV7O3fibI38H2MfHuJ'
const removeAudioFeatures = ['type', 'id', 'uri', 'track_href', 'duration_ms'];
    

const getTrackAudioFeatures = async (accessToken, trackIds=[]) => {
    // max is 100 at a time, make this loop over 100 at at time
    const url = 'https://api.spotify.com/v1/audio-features?';

    let offset = 0;
    const limit = 100;
    var audioFeatures = [];

    while (offset < trackIds.length) {
        const queryParams = new URLSearchParams();
        queryParams.append('ids', trackIds.slice(offset, offset+limit).join(','));
        const response = await fetch(`${url}${queryParams.toString()}`, {
            headers: {
            'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        audioFeatures = audioFeatures.concat(data.audio_features);
        offset += limit;
    }
    return audioFeatures;
};

function splitArrayByLength(arr, lengths) {
    const result = [];
    let index = 0;
    // [[genre]]
    lengths.forEach(length => {
        // [[genre]] -> [[genre]] smaller -> [genre]
      result.push([...new Set(arr.slice(index, index + length).flat())]);
      index += length;
    });
    // [[genre]]
    return result;
}

const getArtistGenres = async (accessToken, artistIds=[], artistLengths) => {
    // max is 50 at a time, make this loop over 50 at a time
    const url = 'https://api.spotify.com/v1/artists?';
    var offset = 0;
    const limit = 50;
    var artistsGenres=[];

    while (offset < artistIds.length) {
        const queryParams = new URLSearchParams();
        queryParams.append('ids', artistIds.slice(offset,offset+limit).join(','));
        const response = await fetch(`${url}${queryParams.toString()}`, {
            headers: {
            'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        artistsGenres = artistsGenres.concat(data.artists.map(artist => artist.genres));
        offset += limit;
    }
    return splitArrayByLength(artistsGenres, artistLengths);
};

const removeTrackFeatures = ['available_markets', 'uri', 'external_urls', 'preview_url', 'disc_number', 'track_number', 'is_local', 'external_ids'];
function getItemsNotShared(list1, list2) {
    const set1 = new Set(list1);
    const set2 = new Set(list2);
  
    const itemsNotShared = [];
  
    for (const item of set1) {
      if (!set2.has(item)) {
        itemsNotShared.push(item);
      }
    }
  
    for (const item of set2) {
      if (!set1.has(item)) {
        itemsNotShared.push(item);
      }
    }
  
    return itemsNotShared;
  }

async function addTrackMetadata(tracks, accessToken) {
    const trackIds = tracks.items.map(track => track.id);
    var audioFeatures = await getTrackAudioFeatures(accessToken, trackIds);
    
    // [SPOTIFY-BUG] very few tracks don't have audio features. This is not recorded anywhere
    audioFeatures = audioFeatures.filter(item => item !== null && item !== undefined);
    const audioIds = audioFeatures.map(track => track.id);
    const missingTrackIds = getItemsNotShared(trackIds, audioIds);
    tracks.items = tracks.items.filter(track => !missingTrackIds.includes(track.id));



    tracks.items.forEach(obj => {
        const audioFeature = audioFeatures.find(feature => feature.id === obj.id);
        removeAudioFeatures.forEach(key => delete audioFeature[key]);
        removeTrackFeatures.forEach(key => delete obj[key]);
        obj.audioFeatures = audioFeature;
    });
   
    const trackArtistsIds = tracks.items.map(track => track.artists.map(artist => artist.id));
    
    const artistIdSections = trackArtistsIds.map(artistIds => artistIds.length);

    const artistGenres = await getArtistGenres(accessToken, trackArtistsIds.flat(), artistIdSections);
    tracks.items.forEach((track, index) => {
        const genres = artistGenres[index];
        track.genresConcat = genres;
        track.artists = track.artists.map((artist) => artist.name); 
    });
}


const removeAlbumFeatures = ['album_type', 'available_markets', 'uri', 'external_urls', 'release_date_precision', 'copyrights', 'external_ids'];
const getAlbums = async (accessToken, albumIds=[]) => {
    // max is 20 at a time, make this loop over 20 at a time
    const url = 'https://api.spotify.com/v1/albums?';

    let offset = 0;

    const limit = 20;
    var albums = [];

    while (offset < albumIds.length) {
        const queryParams = new URLSearchParams();
        queryParams.append('ids', albumIds.slice(offset,offset+limit).join(','));
        const response = await fetch(`${url}${queryParams.toString()}`, {
            headers: {
            'Authorization': `Bearer ${accessToken}`
            }
        });
        const data = await response.json();
        data.albums.forEach(album => {
            removeAlbumFeatures.forEach(key => delete album[key]);
        });
        albums = albums.concat(data.albums);
        offset += limit;
    }
    return albums;
};



function parseSinglePlaylist(playlist) {
    //  TODO make a set of all genres
    const genres = playlist.tracks.items.map(track => track.genresConcat).flat();

    return {

        'playlistName': playlist.name,
        'artistName': (playlist.owner.display_name) ? playlist.owner.display_name : playlist.owner.id,
        'thumbnailUrl': playlist.images[0].url,
        'genres': genres, //and union with artist genre
        'songs': parseSpotifyTracks(playlist.tracks.items),
        'duration': playlist.tracks.total, // convert to min
        'playlistLink': playlist.href,
        'tracksNextLink': playlist.tracks.next,
        'popularity': playlist.followers.total,
        'type': 'spotify',
    };
}



// no bulk api for playlists from sptoify
const removeSinglePlaylistFeatures = ['collaborative', 'uri', 'external_urls', 'href', 'public', 'snapshot_id', 'type', 'uri', 'primary_color'];
const getSinglePlaylist = async (accessToken, playlistLink) => {
    const response = await fetch(playlistLink, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    const playlist = await response.json();
    removeSinglePlaylistFeatures.forEach(key => delete playlist[key]);
    await addTrackMetadata(playlist.tracks, accessToken);
    return parseSinglePlaylist(playlist);
};


// from search endpoint
function parsePlaylists(playlists) {
    return playlists.map(playlist => {
        return {
            //uuid: not created yet
            'dateCreated': null, //none for spotify
            'description': playlist.description, // none for spotify
            'name': playlist.name,
            'author': (playlist.owner.display_name) ? playlist.owner.display_name : playlist.owner.id,
            'isFavorited': false,
            'coverImageURL': playlist.images[0].url,
            'songs': playlist.href, // best not to fetch while searching. better to click on it
            'originId': playlist.id,
            'isAlbum': false,

            // extra
            'duration': playlist.tracks.total, // convert to min
            'uri': playlist.uri,
            'type': 'spotify'
        };
    });
}

const removeSharedFeatures=['href', 'limit', 'offset', 'previous', 'total'];
const getSpotify = async (accessToken, query, types=['album', 'playlist', 'track']) => {

    const url = 'https://api.spotify.com/v1/search?';
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('type', types.join(','));
    queryParams.append('limit', 20);


    const response = await fetch(`${url}${queryParams.toString()}`, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    if (types.includes('track')) {
        await addTrackMetadata(data.tracks, accessToken);
        data.tracks.items = parseSpotifyTracks(data.tracks.items);
        removeSharedFeatures.forEach(key => delete data.tracks[key]);
    }

    if (types.includes('album')) {
        await addAlbumMetadata(data.albums, accessToken);    
        data.albums.items = parseSpotifyAlbums(data.albums.items);
        removeSharedFeatures.forEach(key => delete data.albums[key]);
    }

    if (types.includes('playlist')) {
        // console.log(data.playlists);
        data.playlists.items = parsePlaylists(data.playlists.items);
        removeSharedFeatures.forEach(key => delete data.playlists[key]);
    }

    return data;
};



async function addAlbumMetadata(albumsObj, accessToken) {
    const albumIds = albumsObj.items.map(album => album.id);
    const albums = await getAlbums(accessToken, albumIds);
    const trackLens = albums.map(album => album.total_tracks);
    const albumTracks={};
    albumTracks.items = [].concat.apply([], albums.map(album => album.tracks.items));
    await addTrackMetadata(albumTracks, accessToken);

    const annotatedTracks = splitArrayByLength(albumTracks.items, trackLens);
    const concatGenres = annotatedTracks.map(tracks => tracks.map(track => track.genresConcat));
    const genresPerAlbum = concatGenres.map(genres => [... new Set(genres.flat())]);
    albumsObj.items = albums;
    
    albums.forEach((album, index) => {
        album.tracks.items = annotatedTracks[index];
        album.genresConcat = genresPerAlbum[index];
        album.artists = album.artists.map((artist) => artist.name);
    });
}





const getSpotifyNext = async (accessToken, nextQuery, types) => {

    const response = await fetch(nextQuery, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    if (types.includes('track')) {
        await addTrackMetadata(data.tracks, accessToken);
        data.tracks.items = parseSpotifyTracks(data.tracks.items);
        removeSharedFeatures.forEach(key => delete data.tracks[key]);
    }

    if (types.includes('album')) {
        await addAlbumMetadata(data.albums, accessToken);    
        data.albums.items = parseSpotifyAlbums(data.albums.items);
        removeSharedFeatures.forEach(key => delete data.albums[key]);
    }

    if (types.includes('playlist')) {
        // console.log(data.playlists);
        data.playlists.items = parsePlaylists(data.playlists.items);
        removeSharedFeatures.forEach(key => delete data.playlists[key]);
    }

    return data;
};



// Function to delay the next request by 3 seconds
const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));


// Middleware to enforce rate limit of 3 seconds
const rateLimitMiddleware = async (req, res, next) => {
    await delay(2000);
    next();
  };


//  q is search query
spotifySearchRouter.get('/', rateLimitMiddleware, async (req, res) => {
    try {
      const searchTerm = req.query.q; // Get the search term from the query parameters
      const searchType = req.query.type || 'all'; // Get the search type from the query parameters (default to 'all')
      const accessToken = req.query.accessToken;  
      if (!accessToken) {
        return res.status(400).json({ error: 'Spotify access token is missing.' });
      }
      if (!searchTerm) {
        return res.status(400).json({ error: 'Youtube Search term is missing.' });
      }
      var searchResults;
  
      // Call a function to fetch YouTube search results using the YouTube Data API
      searchResults = await getSpotify(accessToken, searchTerm, (searchType==='all')? ['track','album','playlist']:[searchType]);
      
      for (let key in searchResults) {
        const cookieId = uuid();
        res.cookie(cookieId, searchResults[key].next);
        searchResults[key].next = cookieId;
       }
      
      return res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .send(searchResults);
    } catch (error) {
      console.error('Error fetching Spotify search results:', error);
      res.status(500).json({ error: 'Something went wrong with Spotify.' });
    }
  });




  spotifySearchRouter.get('/next', rateLimitMiddleware, async (req, res) => {
    try {
      
        const cookieId = req.query.cookieId;
        const continuation = req.cookies[cookieId];
        const searchType = req.query.type; // Get the search type from the query parameters (default to 'all')
        const accessToken = req.query.accessToken;  
  
        // Check if the cookieId is provided in the query parameters
        if (!cookieId) {
            return res.status(400).json({ error: 'Missing cookieId in the request.' });
        }
      
      if (!accessToken) {
        return res.status(400).json({ error: 'Spotify access token is missing.' });
      }
      if (!continuation) {
        return res.status(400).json({ error: 'Invalid or expired continuation token.' });
      }

      if (!searchType) {
        return res.status(400).json({ error: 'Invalid search type.' });
       }

      var searchResults;
  
      // Call a function to fetch YouTube search results using the YouTube Data API
      console.log(continuation);
      searchResults = await getSpotifyNext(accessToken, continuation, [searchType]);
      for (let key in searchResults) {
        res.cookie(cookieId, searchResults[key].next);
        searchResults[key].next = cookieId;
       }

      return res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .send(searchResults);
    } catch (error) {
      console.error('Error fetching Spotify search results:', error);
      res.status(500).json({ error: 'Something went wrong with Spotify.' });
    }
  });

module.exports = spotifySearchRouter;