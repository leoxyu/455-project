import { store } from "./store";

export const getUserId = () => {
    return store.getState().login.id;
}

export const getAuthorID = () => {
    return store.getState().login.authorID;
}
