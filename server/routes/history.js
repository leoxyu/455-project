var express = require('express');
var historyRouter = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const { DATABASE_NAME, HISTORY_COLLECTION, PLAYLIST_COLLECTION_TEST, USER_COLLECTION, SG_ANALYSIS_COLLECTION, PL_ANALYSIS_COLLECTION } = require("../shared/mongoConstants");
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const historyCol = database.collection(HISTORY_COLLECTION);
const playlistCol = database.collection(PLAYLIST_COLLECTION_TEST);
const userCol = database.collection(USER_COLLECTION);
const playlistsAnalysisCol = database.collection(PL_ANALYSIS_COLLECTION);
const songsAnalysisCol = database.collection(SG_ANALYSIS_COLLECTION);


// Middleware to extract Bearer token from Authorization header
const extractBearerToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      req.accessToken = authHeader.substring(7); // Remove 'Bearer ' to get the token
    }
    next();
  };

  historyRouter.use(extractBearerToken);

  const extractAdminPWD = (req, res, next) => {
    const authHeader = req.headers.authorizationadmin;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      req.adminPwd = authHeader.substring(7); // Remove 'Bearer ' to get the token
    }
    next();
  };





  const removeAudioFeatures = ['type', 'id', 'uri', 'track_href', 'duration_ms', 'analysis_url'];
    

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
    function filterOutNulls(list) {
        return list.filter(item => item !== null && item !==undefined);
      }

  async function annotateTrackMetadata(tracks, accessToken) {
      tracks = filterOutNulls(tracks);
      const trackIds = tracks.map(track => track.id); // spotify playlist object is nested
      var audioFeatures = await getTrackAudioFeatures(accessToken, trackIds);
      
      // [SPOTIFY-BUG] very few tracks don't have audio features. This is not recorded anywhere
      audioFeatures = filterOutNulls(audioFeatures);
      const audioIds = audioFeatures.map(track => track.id);
      const missingTrackIds = getItemsNotShared(trackIds, audioIds);
      tracks = tracks.filter(track => !missingTrackIds.includes(track.id));
  
  
  
      tracks.forEach(obj => {
          const audioFeature = audioFeatures.find(feature => feature.id === obj.id);
          removeAudioFeatures.forEach(key => delete audioFeature[key]);
          removeTrackFeatures.forEach(key => delete obj[key]);
          obj.audioFeatures = audioFeature;
      });
     
      const trackArtistsIds = tracks.map(track => track.artists.map(artist => artist.id));
      
      const artistIdSections = trackArtistsIds.map(artistIds => artistIds.length);
  
      const artistGenres = await getArtistGenres(accessToken, trackArtistsIds.flat(), artistIdSections);
      tracks.forEach((track, index) => {
          const genres = artistGenres[index];
          track.genresConcat = genres;
          track.artists = track.artists.map((artist) => artist.name); 
      });
  }


  function calculateChunks(len) {
    const maxStride = 50;
    const n = parseInt(len/maxStride);
    const remainder = len%maxStride;
    const sizes = Array(n).fill(maxStride);
    if (remainder) {
        sizes.push(remainder);
    }
    return sizes;
}


    async function generateMetadataSpotify(songIds, accessToken, unifiIds) {
        const url = 'https://api.spotify.com/v1/tracks?';

        const chunkSizes = calculateChunks(songIds.length);
        const res = [];

        const unifiIdChunks = chunkArray(unifiIds, chunkSizes);
        
        for (const [i,chunk] of chunkArray(songIds, chunkSizes).entries()) {
            const currUnifiChunk = unifiIdChunks[i];
            const originIdToUnifiId = {};
            for (const [j,originId] of chunk.entries()) {
                originIdToUnifiId[originId] = currUnifiChunk[j];
            }


            const queryParams = new URLSearchParams();
            queryParams.append('ids', chunk.join(',')); // Use the current chunk

            const response = await fetch(`${url}${queryParams.toString()}`, {
                headers: {
                    'Authorization': `Bearer ${accessToken}`
                }
            });
            const data = await response.json();
            
            

            await annotateTrackMetadata(data.tracks, accessToken);
            // console.log(data.tracks);

            res.push(...parseSpotifyTracks(data.tracks, originIdToUnifiId));

            await new Promise(resolve => setTimeout(resolve, 200)); // timy timeout for rate limiting
        }

        return res;
    }



  function partitionList(list, chunkSize) {
    const partitions = [];
    for (let i = 0; i < list.length; i += chunkSize) {
        partitions.push(list.slice(i, i + chunkSize));
    }
    return partitions;
   }







function parseSpotifyTracks(items, originIdToUnifiId) {
    items = filterOutNulls(items);
    return items.map((track,i) => {
        return {
            'songID': originIdToUnifiId[track.id],
            'originID': track.id, 
            'source': 'spotify',
            'popularity': track.popularity,
            'genres': track.genresConcat,
            ...track.audioFeatures,
        };
    });
}









// restart history db
historyRouter.put('/',extractAdminPWD, async (req, res, next) => {
    if (req.adminPwd !== process.env.ML_PWD)
        return res.status(401).send("Admin token incorrect");
    try {
        const users = await userCol.find({}).toArray();
        const historyElems = users.map(user => {return ({userID:user._id, spotifySongs:[]})});
        await historyCol.deleteMany({});
        await historyCol.insertMany(historyElems);
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
    return res.status(200).send("Success");
});



const NUMERIC_AUDIO_FEATURES = [
    "danceability",
    "energy",
    "key",
    "loudness",
    "mode",
    "speechiness",
    "acousticness",
    "instrumentalness",
    "liveness",
    "valence",
    "tempo",
    "time_signature",
]

const PLAYLIST_AUDIO_FEATURES = [...NUMERIC_AUDIO_FEATURES, "genres"];

function spotifyPlaylistCombinator(subarray) {
const summary ={};
for (const key of PLAYLIST_AUDIO_FEATURES) {
    summary[key] = subarray.map(song => song[key]).flat();
    if (NUMERIC_AUDIO_FEATURES.includes(key)) {
        summary[key] = summary[key].reduce((a, b) => a + b, 0) / summary[key].length;
    }
}
return summary
}



function createPlaylistObjects(subarrays, playlistInfo) {
return subarrays.map((subarray, index) => {
    return {
        playlistID: playlistInfo[index].playlistID,
        originId: playlistInfo[index].originId,
        source: playlistInfo[index].source,
        duration: subarray.length,
        ...spotifyPlaylistCombinator(subarray)
    };
});
}

function chunkArray(arr, lengths) {
    const chunkedArray = [];
    let currentIndex = 0;
    
    for (let i = 0; i < lengths.length; i++) {
        const chunkSize = lengths[i];
        chunkedArray.push(arr.slice(currentIndex, currentIndex + chunkSize));
        currentIndex += chunkSize;
    }
    
    return chunkedArray;
}

// annotate all spotify songs and throw into a collection if not already there
historyRouter.put('/analyze_playlists',extractAdminPWD, async (req, res, next) => {
    if (req.adminPwd !== process.env.ML_PWD)
        return res.status(401).send("Access token incorrect");

    const accessToken = req.accessToken;
    if (!accessToken) {
        return res.status(500).send("Missing spotify access token");
    }
    try {
        const playlists = await playlistCol.find({}).toArray();

        // spotify
        const spotifyPlaylists = playlists;
        spotifyPlaylists.forEach(playlist => {playlist.songs = playlist.songs.filter((song) => song.source === 'spotify')}); 
        const spotifyPlaylistLengths = spotifyPlaylists.map((playlist) => playlist.songs.length);
        const spotifySongs = spotifyPlaylists.reduce((rsf, obj) => rsf.concat(obj.songs), []);
        const spotifyIds = spotifySongs.map((song) => parseSpotifyTrackOriginID(song.link));
        const unifiIds = spotifySongs.map((song)=>song.songID);
        
        const resultSpotifySongs = await generateMetadataSpotify(spotifyIds, accessToken, unifiIds);
        const chunkedSpotifySongs = chunkArray(resultSpotifySongs, spotifyPlaylistLengths);
        const resultSpotifyPlaylists = createPlaylistObjects(chunkedSpotifySongs, spotifyPlaylists);

        // youtube



        await songsAnalysisCol.deleteMany({});
        await playlistsAnalysisCol.deleteMany({});

        await songsAnalysisCol.insertMany(resultSpotifySongs);
        await playlistsAnalysisCol.insertMany(resultSpotifyPlaylists);

    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
    return res.status(200).send("Success");
});


function parseSpotifyTrackOriginID(trackLink) {
    return trackLink.split('spotify:track:')[1];
}

function parseYoutubeVideoOriginID(trackLink) {
    const url = new URL(trackLink);
    return url.searchParams.get("v");
}

historyRouter.post('/:id', async (req, res, next) => {
    const song = req.body.song;
    const source = song.source;
    const userID = req.params.id;
    const accessToken = req.accessToken;
    try {
        let annotatedData;
        let result;
        let originId;
        if (source === 'spotify') {

            if (!accessToken) {
                return res.status(401).send("Access token not provided");
            }
            originId = parseSpotifyTrackOriginID(song.link);

            const parsedAnnotations = await generateMetadataSpotify([originId], accessToken, [song.songID]);
            
            if (parsedAnnotations.length === 0 || Object.keys(parsedAnnotations[0]).length === 0) {
                return res.status(400).send("Invalid song ID");
            }       
            annotatedData = parsedAnnotations[0]; 

            result = await historyCol.updateOne(
                { userID: new ObjectId(userID) },
                { $push: { spotifySongs: annotatedData } },
                { upsert: true}
                );

            if (!result.modifiedCount) {
                return res.status(404).json({ message: `user ${userID} not found` });
            }
            return res.status(200).send({ userID, annotatedData });
        } else {

            // youtube functions ...
            throw new Error("Youtube not implemented.");
        }
    } catch (e) {
        if (e.codeName === "DocumentValidationFailure" || e.code === 121) {
            return res.status(400).send(e);
        }
            return res.status(500).send(e);
    }
  });



//   function recommendSongs


module.exports = historyRouter;
