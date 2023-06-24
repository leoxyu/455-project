import { createAsyncThunk } from "@reduxjs/toolkit";
import LoginService from "./service";

export const loginAsync = createAsyncThunk(
    'LOGIN',
    async ({ username, password }) => {
        return await LoginService.login(username, password);
    }
)

export const registerAsync = createAsyncThunk(
    'REGISTER',
    async ({ username, password }) => {
        return await LoginService.register(username, password);
    }
)