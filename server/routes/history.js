var express = require('express');
var historyRouter = express.Router();
const { MongoClient, ObjectId } = require("mongodb");
const { DATABASE_NAME, HISTORY_COLLECTION, PLAYLIST_COLLECTION_TEST, USER_COLLECTION, SG_ANALYSIS_COLLECTION, PL_ANALYSIS_COLLECTION, SIMILARITY_COLLECTION, RECOMMENDATION_COLLECTION, SIMILARITY_MAPPING_COLLECTION } = require("../shared/mongoConstants");
require('dotenv').config();

const client = new MongoClient(process.env.MONGO_URI);
const database = client.db(DATABASE_NAME);
const historyCol = database.collection(HISTORY_COLLECTION);
const playlistCol = database.collection(PLAYLIST_COLLECTION_TEST);
const userCol = database.collection(USER_COLLECTION);
const playlistsAnalysisCol = database.collection(PL_ANALYSIS_COLLECTION);
const songsAnalysisCol = database.collection(SG_ANALYSIS_COLLECTION);
const similarityCol = database.collection(SIMILARITY_COLLECTION);
const similarityMappingCol = database.collection(SIMILARITY_MAPPING_COLLECTION);

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


    async function generateMetadataSpotify(songIds, accessToken, unifiSongObjs) {
        const url = 'https://api.spotify.com/v1/tracks?';

        const chunkSizes = calculateChunks(songIds.length);
        const res = [];

        const unifiSongChunks = chunkArray(unifiSongObjs, chunkSizes);
        
        for (const [i,chunk] of chunkArray(songIds, chunkSizes).entries()) {
            const currUnifiChunk = unifiSongChunks[i];
            const originIdToUnifiSong = {};
            for (const [j,originId] of chunk.entries()) {
                originIdToUnifiSong[originId] = currUnifiChunk[j];
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

            res.push(...parseSpotifyTracks(data.tracks, originIdToUnifiSong));

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







function parseSpotifyTracks(items, originIdToUnifiSong) {
    items = filterOutNulls(items);
    return items.map((track,i) => {
        const unifiSong = originIdToUnifiSong[track.id];
        return {
            ...unifiSong,
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
];

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
        return res.status(401).send("Admin token incorrect");

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
        
        const resultSpotifySongs = await generateMetadataSpotify(spotifyIds, accessToken, spotifySongs);
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


historyRouter.put('/recommender', extractAdminPWD, async (req, res, next) => {
    if (req.adminPwd !== process.env.ML_PWD)
        return res.status(401).send("Admin token incorrect");
    try {
        await precomputeAndSaveRecommender();
        return res.status(200).send("Success");
    }
    catch (err) {
        console.log(err);
        return res.status(500).send("Internal server error");
    }
});


function parseSpotifyTrackOriginID(trackLink) {
    return trackLink.split('spotify:track:')[1];
}

function parseYoutubeVideoOriginID(trackLink) {
    const url = new URL(trackLink);
    return url.searchParams.get("v");
}

historyRouter.post('/:id', async (req, res, next) => {
    const songID = req.body.songID;
    const source = req.body.source;
    const userID = req.params.id;
    try {
        let result;
        if (source === 'spotify' && songID) {

            result = await historyCol.updateOne(
                { userID: new ObjectId(userID) },
                { $push: { spotifySongs: songID} },
                { upsert: true}
                );

            if (!result.modifiedCount) {
                return res.status(404).json({ message: `user ${userID} not found` });
            }
            return res.status(200).send({ songID });
        } else {
            // youtube functions ...
            throw new Error("History currently only set up for ");
        }
    } catch (e) {
        if (e.codeName === "DocumentValidationFailure" || e.code === 121) {
            return res.status(400).send(e);
        }
            return res.status(500).send(e);
    }
  });

historyRouter.get('/recommendations/:id', async (req, res, next) => {
    const userID = req.params.id;
    let limit = req.params.limit;
    if (!limit) {
        limit = 5;
    }
    try {
        const user = await userCol.findOne({ _id: new ObjectId(userID) });
        const userHistory = await historyCol.findOne({ userID: new ObjectId(userID) });
        if (!user || !userHistory) {
            return res.status(404).json({ message: `user ${userID} not found` });
        }
        // Initialize an empty array to store the recommendations
        // Use Promise.all to run recommendations for each songID in parallel
        if (userHistory.spotifySongs.length === 0) {
            return res.status(200).json({});
        }

        // return 5 recommendations per watched song
        userHistory.spotifySongs = userHistory.spotifySongs.slice(0, Math.floor(limit/5));

        const recommendationsPromises = userHistory.spotifySongs.map(async (songID) => {
            return recommendSimilarSongs(songID, 5);
            });

        const recommendationsArrays = await Promise.all(recommendationsPromises);
        const closestSongIds = [...new Set(recommendationsArrays.flat())];
        const recommendedSongs = await songsAnalysisCol.find({ songID: { $in: closestSongIds } }).toArray();
        return res.status(200).json(recommendedSongs);
    } catch (e) {
        if (e.codeName === "DocumentValidationFailure" || e.code === 121) {
            return res.status(400).send(e);
        }
            return res.status(500).send(e);
    }
});

historyRouter.get('/:id', async (req, res, next) => {
    const userID = req.params.id;
    try {
        const user = await userCol.findOne({ _id: new ObjectId(userID) });
        const userHistory = await historyCol.findOne({ userID: new ObjectId(userID) });
        if (!user || !userHistory) {
            return res.status(404).json({ message: `user ${userID} not found` });
        }
        const songs = await songsAnalysisCol.find({ songID: { $in: userHistory.spotifySongs } }).toArray();
        return res.status(200).json(songs);
    } catch (e) {
        if (e.codeName === "DocumentValidationFailure" || e.code === 121) {
            return res.status(400).send(e);
        }
            return res.status(500).send(e);
    }
});


const { Matrix } = require('ml-matrix');


function preComputeSongSimilarityMatrix(songs) {
    // Extract features into a matrix
    const featureMatrix = new Matrix(songs.map(song => 
    {
        return NUMERIC_AUDIO_FEATURES.map(feature => song[feature]);
    }));

    // Compute the cosine similarity matrix
    return computeCosineSimilarityMatrix(featureMatrix);
}


// Function to compute the cosine similarity matrix
function computeCosineSimilarityMatrix(matrix) {
  const numRows = matrix.rows;
  const similarityMatrix = new Matrix(numRows, numRows);

  for (let i = 0; i < numRows; i++) {
    for (let j = i; j < numRows; j++) {
      const cosineSimilarity = cosineSimilarityBetweenRows(matrix.getRow(i), matrix.getRow(j));
      similarityMatrix.set(i, j, cosineSimilarity);
      similarityMatrix.set(j, i, cosineSimilarity);
    }
  }

  return similarityMatrix;
}



// Function to compute the cosine similarity between two rows
function cosineSimilarityBetweenRows(rowA, rowB) {
  const dotProduct = rowA.reduce((sum, valueA, index) => sum + valueA * rowB[index], 0);
  const normA = Math.sqrt(rowA.reduce((sum, value) => sum + value * value, 0));
  const normB = Math.sqrt(rowB.reduce((sum, value) => sum + value * value, 0));

  return dotProduct / (normA * normB);
}



// Function to find index of a song ID in the list
function findSongIndex(songIDs, songID) {
    return songIDs.indexOf(songID);
  }


  function findKMostSimilar(scores, k) {
    console.log('findining the most similar');
    // Create an array of indices [0, 1, 2, ...] to keep track of song indices
    const indices = scores.map((score, index) => index);
    // Sort indices based on the similarity scores in descending order
    indices.sort((a, b) => scores[b] - scores[a]);
    // Return the first k indices
    return indices.slice(0, k);
}





async function recommendSimilarSongs(songID, k) {
    let similarityScores = await similarityCol.findOne({songID: songID });
    if (!similarityScores) {
        throw new Error("Song not found in recommender database");
    }
    // Find the k most similar songs
    const mostSimilarIndices = findKMostSimilar(similarityScores.similarities, k+1); // in case it is itself
    const mostSimilarSongIDPromises = mostSimilarIndices.map(async (index) => 
        await similarityMappingCol.findOne({index: index}));

    const mostSimilarSongIDs = (await Promise.all(mostSimilarSongIDPromises)).map(obj => obj.songID);
    return mostSimilarSongIDs.filter(id => id !== songID);
}


async function precomputeAndSaveRecommender() {
    // mongoDB query to get all songs
    const songs = await songsAnalysisCol.find({}).toArray();
    const featureRowNames = songs.map(song => song.songID);
    const similarityMatrix = await preComputeSongSimilarityMatrix(songs);
    const idMappings = [];
    for (let i = 0; i < featureRowNames.length; i++) {
        idMappings.push({
            "songID":featureRowNames[i],
            "similarities":similarityMatrix.getRow(i)
        });
    }

    const idxSongIDMappings = featureRowNames.map((songID, index) => { return {index: index, songID: songID}});
    await similarityCol.deleteMany({});
    await similarityMappingCol.deleteMany({});
    await similarityMappingCol.insertMany(idxSongIDMappings);
    await similarityCol.insertMany(idMappings);
    
    
}



module.exports = historyRouter;
