





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
function parseSpotifyTracks(items, thumbnailUrl=false, release_date=false, popularity=false) {
    return items.map(track => {
        return {
            'songName': track.name,
            'artists': track.artists,
            'thumbnailUrl': (thumbnailUrl)? thumbnailUrl : track.album.images[0].url,
            'views': (popularity)? popularity: track.popularity, // TODO: change to popularity
            'releaseDate': (release_date)? release_date: track.album.release_date,
            'genres': track.genresConcat, //and union with artist genre
            'audioFeatures': track.audioFeatures,
            'duration': formatDuration(track.duration_ms), // convert to min
            'songLink': track.href
        };
});
}


function parseSpotifyAlbums(items) {
    return items.map(album => {
        return {

            'playlistName': album.name,
            'artistName': album.artists,
            'thumbnailUrl': album.images[0].url,
            'date': album.release_date,
            'genres': album.genresConcat, //and union with artist genre
            'songs': parseSpotifyTracks(album.tracks.items,
                album.images[0].url,
                album.release_date,
                album.popularity),
            'duration': album.total_tracks, // convert to min
            'playlistLink': album.href,
            'tracksNextLink': album.tracks.next,
            'popularity': album.popularity
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

async function addTrackMetadata(tracks, accessToken) {
    const trackIds = tracks.items.map(track => track.id);
    const audioFeatures = await getTrackAudioFeatures(accessToken, trackIds);
    // console.log(audioFeatures[0]);
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
        'popularity': playlist.followers.total
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
            'playlistName': playlist.name,
            'artistName': (playlist.owner.display_name) ? playlist.owner.display_name : playlist.owner.id,
            'thumbnailUrl': playlist.images[0].url,
            'description': playlist.description, //and union with artist genre,
            'duration': playlist.tracks.total, // convert to min
            'playlistLink': playlist.href,
        };
    });
}


const getSpotify = async (accessToken, query, types=['album', 'playlist', 'track']) => {

   
    const url = 'https://api.spotify.com/v1/search?';
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('type', types.join(','));
    queryParams.append('limit', 7);


    const response = await fetch(`${url}${queryParams.toString()}`, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    if (types.includes('track')) {
        await addTrackMetadata(data.tracks, accessToken);
        // console.log(data.tracks)
        data.tracks.items = parseSpotifyTracks(data.tracks.items);
    }

    if (types.includes('album')) {
        // console.log(data.albums);
        await addAlbumMetadata(data.albums, accessToken);    
        // console.log(data.albums)
        data.albums.items = parseSpotifyAlbums(data.albums.items);
    }

    if (types.includes('playlist')) {
        console.log(data.playlists);
        data.playlists.items = parsePlaylists(data.playlists.items);
    }

    console.log("after adding album metadata");
    // console.log(data.tracks);
    // console.log(data.albums);
    console.log(data.playlists);

    return data;
};





export default {
    getSpotify
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

