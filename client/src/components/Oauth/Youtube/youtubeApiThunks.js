import { createAsyncThunk } from "@reduxjs/toolkit";
import { youtubeLogin } from "./youtubeApiActions";

export const youtubeLoginThunk = createAsyncThunk(
  'YOUTUBE_LOGIN',
  async () => {
    return await youtubeLogin();
  }
);