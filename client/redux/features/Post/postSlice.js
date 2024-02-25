
'use client';

import { createSlice } from '@reduxjs/toolkit';

let initialState = {
  posts: [],
};

const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    setPosts: (state, action) => {
      state.posts = action.payload;
    },
    setMorePosts: (state, action) => {
      state.posts = action.payload;
    },
    addPost: (state, action) => {
      const { data, userInfo } = action.payload;
      const addedPostFormat = {
        id: data?.post?._id,
        authorId: userInfo?._id,
        authorName: userInfo?.name,
        authorImage: userInfo?.profilePicture,
        authorRole: userInfo?.role,
        authorRoleNumber: userInfo?.roleNumber,
        content: data?.post?.content,
        media: data?.post?.mediaUrls,
        mediaType: data?.post?.mediaType,
        isAnnouncement: data?.post?.isAnnouncement,
        assignmentDueDate: data?.post?.assignmentDueDate,
        classroom: data?.post?.classroom,
        createdAt: data?.post?.createdAt,
        reports: [],
        likes: [],
        comments: [],
        saves: []
      }
      state.posts = [addedPostFormat, ...state.posts];
    },
    toggleLike: (state, action) => {
      const { postId, user } = action.payload;
      const post = state.posts.find(post => post.id === postId);

      if (post) {
        const likedIndex = post.likes.findIndex(like => like.id === user._id);

        if (likedIndex !== -1) {
          post.likes.splice(likedIndex, 1);
        } else {
          post.likes.push({ id: user._id, name: user.name });
        }
      }
    },
    toggleSave: (state, action) => {
      const { postId, userId } = action.payload;
      const post = state.posts.find(post => post.id === postId);

      if (post) {
        const savedIndex = post.saves.findIndex(user => user === userId);

        if (savedIndex !== -1) {
          post.saves.splice(savedIndex, 1);
        } else {
          post.saves.push(userId);
        }
      }
    },
    setPostComment: (state, action) => {
      const { postId, comment, user } = action.payload;

      const post = state.posts.find(post => post.id === postId);

      if (post) {
        const newComment = {
          author: user.name,
          authorImage: user.profilePicture,
          text: comment.text,
          mediaType: comment.mediaType,
          media: comment.media,
        };

        post.comments.push(newComment);
      }
    },
    filterPost: (state, action) => {
      const postId = action.payload;
      state.posts = state.posts.filter(post => post.id !== postId);
  },

    // setLoggedInUserInfo: (state, action) => {
    //   if (!localStorage.getItem('token')) {
    //     localStorage.setItem('token', JSON.stringify(action.payload.token));
    //   }
    //   state.userInfo = action.payload;
    // },    
    // setRecommendedCourses: (state, action) => {
    //   state.recommendedCourses = action.payload;
    // },
    // logoutUser: (state) => {
    //   localStorage.removeItem('token');
    //   state.userInfo = {};
    //   state.recommendedCourses = [];
    // },
    // setFirstLoginToFalse: (state) => {
    //   state.userInfo = {...state.userInfo, firstLogin: false };
    // }
  },
});

export const { setPosts, setMorePosts, filterPost, addPost, toggleLike, toggleSave, setPostComment } = postSlice.actions;

export default postSlice.reducer;
