import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/User/userSlice";
import universityReducer from "./features/University/universitySlice";
import postReducer from "./features/Post/postSlice";

export const store = configureStore({
    reducer: {
        user: userReducer,
        university: universityReducer,
        post: postReducer
    }
})