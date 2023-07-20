import { store } from "./store";

export const getUserId = () => {
    return store.getState().login.id;
}