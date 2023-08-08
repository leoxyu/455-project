var express = require('express');

var spotifySearchRouter = express.Router();

// Function to delay the next request by 3 seconds
const delay = (duration) => new Promise((resolve) => setTimeout(resolve, duration));


// Middleware to enforce rate limit of 3 seconds
const rateLimitMiddleware = async (req, res, next) => {
    await delay(2000);
    next();
  };

// Middleware to extract Bearer token from Authorization header
const extractBearerToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      req.accessToken = authHeader.substring(7); // Remove 'Bearer ' to get the token
    }
    next();
  };

spotifySearchRouter.use(rateLimitMiddleware);
spotifySearchRouter.use(extractBearerToken);




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
            'source': 'spotify',
            'link': `spotify:track:${track.id}`, // TODO: look at main
            'imageLink': (thumbnailUrl)? thumbnailUrl : track.album.images[0].url,
            'album': (album)? album: track.album.name, 
            'duration': formatDuration(track.duration_ms),
            'releaseDate': (release_date)? release_date: track.album.release_date,

            // extra
            'popularity': (popularity)? popularity: track.popularity, // TODO: change to popularity
            'genres': track.genresConcat, //and union with artist genre
            'audioFeatures': track.audioFeatures,
            
            
        };
});
}

function parseSingleAlbum(album) {
    const genres = [... new Set([...album.genres, ...album.tracks.items.map(track => track.genresConcat).flat()])];
    return {
        // uuid: not created yet
        'dateCreated': album.release_date, 
        'description':null, // none for spotify
        'name': album.name,
        'author': album.artists.join(', '), // need to make artists a string
        'isFavorited': false,
        'coverImageURL': album.images[0].url,
        'songs': parseSpotifyTracks(album.tracks.items, // need to just be the id
            album.images[0].url,
            album.release_date,
            album.popularity,
            album.name),
        'originId': album.id,
        'isAlbum': true,
        'type':'album',
        
        //extra
        'genres': genres, //and union with artist genre
        'duration': album.total_tracks, // convert to min
        // 'playlistLink': album.href,
        'next': album.tracks.next,
        'popularity': album.popularity,
        'uri': album.uri,
        'source': 'spotify',
    };
}

function parseSpotifyAlbums(items) {
    return items.map(album => {
        album.artists = album.artists.map(artist => artist.name);
        return {
            // uuid: not created yet
            'dateCreated': album.release_date, 
            'description':null, // none for spotify
            'name': album.name,
            'author': album.artists.join(', '), // need to make artists a string
            'isFavorited': false,
            'coverImageURL': album.images[0].url,
            'songs': album.id,
            'originId': album.id,
            'isAlbum': true,
            'type':'album',
            
            //extra
            'duration': album.total_tracks, // convert to min
            'uri': album.uri,
            'source': 'spotify',
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
    tracks.items = filterOutNulls(tracks.items); // spotify returns some null entries for some reason...
    const trackIds = tracks.items.map(track => track.id); // spotify playlist object is nested
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
const getSingleAlbum = async (accessToken, albumId, offset, limit) => {
    var playlistLink = `https://api.spotify.com/v1/albums/${albumId}`
    const queryParams = new URLSearchParams();
    if (offset) {
        playlistLink+='?';
        queryParams.append('offset', offset);
    }
    if (limit) {
        queryParams.append('limit', limit);
    }
    playlistLink+=queryParams.toString();
    const response = await fetch(playlistLink, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    const album = await response.json();
    removeAlbumFeatures.forEach(key => delete album[key]);
    await addTrackMetadata(album.tracks, accessToken);
    album.artists = album.artists.map((artist) => artist.name);
    return parseSingleAlbum(album);
};



function parseSinglePlaylist(playlist) {
    const genres = [... new Set(playlist.tracks.items.map(track => track.genresConcat).flat())];
    return {
        //uuid: not created yet
        'dateCreated': new Date(),
        'description': playlist.description, 
        'name': playlist.name,
        'author': (playlist.owner.display_name) ? playlist.owner.display_name : playlist.owner.id,
        'isFavorited': false,
        'coverImageURL': playlist.images[0].url,
        'songs': parseSpotifyTracks(playlist.tracks.items), // best not to fetch while searching. better to click on it
        'originId': playlist.id,
        'isAlbum': false,
        'type':'playlist',
        'next': playlist.tracks.next,

        // extra
        'genres': genres,
        'duration': playlist.tracks.total, // convert to min
        'popularity': playlist.followers.total,
        'uri': playlist.uri,
        'source': 'spotify'
    };
}



// no bulk api for playlists from sptoify
const removeSinglePlaylistFeatures = ['collaborative', 'uri', 'external_urls', 'href', 'public', 'snapshot_id', 'type', 'uri', 'primary_color'];
const getSinglePlaylist = async (accessToken, playlistId, offset, limit) => {
    var playlistLink = `https://api.spotify.com/v1/playlists/${playlistId}`
    const queryParams = new URLSearchParams();
    if (offset) {
        playlistLink+='?';
        queryParams.append('offset', offset);
    }
    if (limit) {
        queryParams.append('limit', limit);
    }
    playlistLink+=queryParams.toString();

    const response = await fetch(playlistLink, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    const playlist = await response.json();
    removeSinglePlaylistFeatures.forEach(key => delete playlist[key]);
    playlist.tracks.items = filterOutNulls(playlist.tracks.items);
    playlist.tracks.items = playlist.tracks.items.map(track => track.track); // spotify nests it due to other metadata
    await addTrackMetadata(playlist.tracks, accessToken);
    return parseSinglePlaylist(playlist);
};


// from search endpoint
function parsePlaylists(playlists) {
    return playlists.map(playlist => {
        return {
            //uuid: not created yet
            'dateCreated': new Date(),
            'description': playlist.description, 
            'name': playlist.name,
            'author': (playlist.owner.display_name) ? playlist.owner.display_name : playlist.owner.id,
            'isFavorited': false,
            'coverImageURL': playlist.images[0].url,
            'songs': playlist.href, // best not to fetch while searching. better to click on it
            'originId': playlist.id,
            'isAlbum': false,
            'type':'playlist',

            // extra
            'duration': playlist.tracks.total, // convert to min
            'uri': playlist.uri,
            'source': 'spotify'
        };
    });
}

const removeSharedFeatures=['href', 'limit', 'offset', 'previous', 'total'];
const getSpotify = async (accessToken, query, types=['album', 'playlist', 'track'], offset, limit) => {

    const url = 'https://api.spotify.com/v1/search?';
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('type', types.join(','));
    
    if (offset) {
        queryParams.append('offset', offset);
    }
    if (limit) {
        queryParams.append('limit', limit);
    } else {
        queryParams.append('limit', 20);
    }


    const response = await fetch(`${url}${queryParams.toString()}`, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    // TODO add message about expiry
    const data = await response.json();
    if (types.includes('track')) {
        data.tracks.items = filterOutNulls(data.tracks.items); 
        await addTrackMetadata(data.tracks, accessToken);
        data.tracks.items = parseSpotifyTracks(data.tracks.items);
        removeSharedFeatures.forEach(key => delete data.tracks[key]);
    }

    if (types.includes('album')) {
        data.albums.items = filterOutNulls(data.albums.items);  
        data.albums.items = parseSpotifyAlbums(data.albums.items);
        removeSharedFeatures.forEach(key => delete data.albums[key]);
    }

    if (types.includes('playlist')) {
        data.playlists.items = filterOutNulls(data.playlists.items); 
        data.playlists.items = parsePlaylists(data.playlists.items);
        removeSharedFeatures.forEach(key => delete data.playlists[key]);
    }

    return data;
};



function filterOutNulls(list) {
    return list.filter(item => item !== null);
  }
  

const getSpotifyNext = async (accessToken, nextQuery, types) => {

    const response = await fetch(nextQuery, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    var data = await response.json();
    if (types.includes('track')) {
        if (!('tracks' in data)) {
            const playlistData = data;
            data = {};
            data.tracks = playlistData;
            data.tracks.items = filterOutNulls(data.tracks.items);
            if (types.includes('playlist-track')) {
                data.tracks.items = data.tracks.items.map(track => track.track);
            }
        }
        await addTrackMetadata(data.tracks, accessToken);
        if (types.includes('album-track')) {
            data.tracks.items = parseSpotifyTracks(data.tracks.items, '', '');
        } else {
            data.tracks.items = parseSpotifyTracks(data.tracks.items);
        }
        removeSharedFeatures.forEach(key => delete data.tracks[key]);
    }

    if (types.includes('album')) {
        data.albums.items = filterOutNulls(data.albums.items); 
        data.albums.items = parseSpotifyAlbums(data.albums.items);
        removeSharedFeatures.forEach(key => delete data.albums[key]);
    }

    if (types.includes('playlist')) {
        data.playlists.items = filterOutNulls(data.playlists.items); 
        data.playlists.items = parsePlaylists(data.playlists.items);
        removeSharedFeatures.forEach(key => delete data.playlists[key]);
    }

    return data;
};




function parseEndpoint(endpoint) {
    const url = new URL(endpoint);
    const parsedParams = new URLSearchParams(url.search);
    parsedParams.set('limit', 50);
    parsedParams.delete('locale');
    const searchParams = parsedParams.toString();
    return searchParams;
}
  
//  q is search query
spotifySearchRouter.get('/', async (req, res) => {
    try {
      const searchTerm = req.query.query; // Get the search term from the query parameters
      const searchType = req.query.type || 'all'; // Get the search type from the query parameters (default to 'all')
      const accessToken = req.accessToken;  
      const offset = req.query.offset;
      const limit = req.query.limit;
      if (!accessToken) {
        return res.status(400).json({ error: 'Spotify access token is missing.' });
      }
      if (!searchTerm) {
        return res.status(400).json({ error: 'Youtube Search term is missing.' });
      }
      var searchResults;
  
      // Call a function to fetch YouTube search results using the YouTube Data API
      searchResults = await getSpotify(accessToken, searchTerm, (searchType==='all')? ['track','album','playlist']:[searchType], offset, limit);
      
      for (let key in searchResults) {
        if (searchResults[key].next) {
            searchResults[key].next = parseEndpoint(searchResults[key].next);
        }
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

  function parseCollectionEndpoint(endpoint) {
    const url = new URL(endpoint);
    const toCrop = '/v1/';
    const v1Index = url.pathname.indexOf('/v1/');
    const parsedParams = new URLSearchParams(url.search);
    parsedParams.delete('locale');
    const endpointAfterV1 = url.pathname.substring(v1Index + toCrop.length) + '?' + parsedParams.toString();
    return endpointAfterV1;
  }
  
  
  spotifySearchRouter.get('/:type/:id/tracks', async (req, res) => {
    try {
        const id = req.params.id; // Get the search term from the query parameters
        const type = req.params.type;
        const offset = req.params.offset;
        const limit = req.params.limit;
        const accessToken = req.accessToken;
        if (!accessToken) {
            return res.status(400).json({ error: 'Spotify access token is missing.' });
        }
        if (!id) {
            return res.status(400).json({ error: 'Spotify playlist id is missing.' });
        }

        var collection;
        if (type === 'albums') {
            collection = await getSingleAlbum(accessToken, id, offset, limit);
        } else {
            collection = await getSinglePlaylist(accessToken, id, offset, limit);
        }
        if (collection.next) {
            collection.next = parseCollectionEndpoint(collection.next);
        }

        return res
        .setHeader('Content-Type', 'application/json')
        .status(200)
        .send(collection);
    } catch (error) {
        console.error('Error fetching Spotify search results:', error);
        res.status(500).json({ error: 'Something went wrong with Spotify.' });
    }
  });




module.exports = spotifySearchRouter;