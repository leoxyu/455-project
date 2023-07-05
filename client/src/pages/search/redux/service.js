
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

const getSpotify = async (accessToken, query, types=['album', 'playlist', 'track']) => {

   
    const url = 'https://api.spotify.com/v1/search?';
    const queryParams = new URLSearchParams();
    queryParams.append('q', query);
    queryParams.append('type', types.join(','));
    queryParams.append('limit', 5);


    const response = await fetch(`${url}${queryParams.toString()}`, {
        headers: {
        'Authorization': `Bearer ${accessToken}`
        }
    });
    const data = await response.json();
    if (types.includes('track')) {
        await addTrackMetadata(data.tracks, accessToken);
    }

    if (types.includes('album')) {
        await addAlbumMetadata(data, accessToken);    
    }

    console.log("after adding album metadata");
    console.log(data.tracks);
    console.log(data.albums);

    return data;
};



export default {
    getSpotify
};

async function addAlbumMetadata(data, accessToken) {
    const albumIds = data.albums.items.map(album => album.id);
    const albums = await getAlbums(accessToken, albumIds);
    const trackLens = albums.map(album => album.total_tracks);
    const albumTracks={};
    albumTracks.items = [].concat.apply([], albums.map(album => album.tracks.items));
    await addTrackMetadata(albumTracks, accessToken);

    const annotatedTracks = splitArrayByLength(albumTracks.items, trackLens);
    const concatGenres = annotatedTracks.map(tracks => tracks.map(track => track.genresConcat));
    const genresPerAlbum = concatGenres.map(genres => [... new Set(genres.flat())]);
    data.albums.items = albums;
    
    data.albums.items.forEach((album, index) => {
        album.tracks.items = annotatedTracks[index];
        album.genresConcat = genresPerAlbum[index];
        album.artists = album.artists.map((artist) => artist.name);
    });
}

