import { createAsyncThunk } from "@reduxjs/toolkit";
import { youtubeLogin, youtubeGetPlaylists } from "./youtubeApiActions";

export const youtubeLoginThunk = createAsyncThunk(
  'YOUTUBE_LOGIN',
  async () => {
    return await youtubeLogin();
  }
);

export const youtubeProfileThunk = createAsyncThunk(
  'YOUTUBE_PLAYLISTS',
  async (access_token) => {
    return await youtubeGetPlaylists(access_token);
  }
);
