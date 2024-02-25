import axios from 'axios';
import { setPosts, addPost, toggleLike, toggleSave, setPostComment, filterPost } from './postSlice';

export const getUserPosts = (token, page, pageSize, isApproved, isAnnouncement, postReport) => async (dispatch) => {
    try {
        let url = `${process.env.API_URL}posts`;

        const queryParams = new URLSearchParams();
        if (page) {
            queryParams.append('page', page);
        }
        if (pageSize) {
            queryParams.append('pageSize', pageSize);
        }
        queryParams.append('isApproved', isApproved ? false : true);
        queryParams.append('isAnnouncement', isAnnouncement ? true : false);
        queryParams.append('reports', postReport ? true : false);

        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getClassroomPosts = (token, page, pageSize, classroomId, isApproved, isAnnouncement, postReport, assignment) => async (dispatch) => {
    try {
        let url = `${process.env.API_URL}posts/classroom/${classroomId}`;

        const queryParams = new URLSearchParams();
        if (page) {
            queryParams.append('page', page);
        }
        if (pageSize) {
            queryParams.append('pageSize', pageSize);
        }
        queryParams.append('isApproved', isApproved ? false : true);
        queryParams.append('isAnnouncement', (isApproved || isAnnouncement) ? true : false);
        queryParams.append('isAssignment', assignment ? true : false);
        queryParams.append('reports', postReport ? true : false);

        if (queryParams.toString()) {
            url += `?${queryParams.toString()}`;
        }

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getUserPostsById = (token, userId) => async (dispatch) => {
    try {
        let url = `${process.env.API_URL}posts/user/${userId}`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(setPosts(response?.data))
        return response;
    } catch (error) {
        return error.response;
    }
};

export const getUserSavedPost = (token) => async (dispatch) => {
    try {
        let url = `${process.env.API_URL}posts/saved/posts`;

        const response = await axios.get(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        dispatch(setPosts(response?.data))
        return response;
    } catch (error) {
        return error.response;
    }
};


export const createPost = (token, postData, userInfo) => async (dispatch) => {
    try {
        const response = await axios.post(`${process.env.API_URL}posts/create-post`, postData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 201) {
            const data = response.data;
            console.log(data)
            dispatch(addPost({ data: data, userInfo, postData }));
        }
        return response;
    } catch (error) {
        return error.response;
    }
};

export const toggleLikePost = (token, postId, userInfo) => async (dispatch) => {
    dispatch(toggleLike({ postId, user: userInfo }));
    try {
        const response = await axios.post(`${process.env.API_URL}posts/like/${postId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status !== 200) {
            dispatch(toggleLike({ postId, user: userInfo }));
        }
        return response;
    } catch (error) {
        return error.response;
    }
};

export const toggleSavePost = (token, postId, userId) => async (dispatch) => {
    dispatch(toggleSave({ postId, userId }));
    try {
        const response = await axios.post(`${process.env.API_URL}posts/save/${postId}`, null, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status !== 200) {
            dispatch(toggleSave({ postId, userId }));
        }
        return response;
    } catch (error) {
        return error.response;
    }
};

export const addComment = (token, postId, payload, user) => async (dispatch) => {
    try {
        const response = await axios.post(`${process.env.API_URL}posts/comment/${postId}`, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            dispatch(setPostComment({ postId, comment: response?.data?.comment, user }));
        }
        return response;
    } catch (error) {
        return error.response;
    }
};

export const deletePost = (token, postId) => async (dispatch) => {
    try {
        const response = await axios.delete(`${process.env.API_URL}posts/delete/${postId}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            dispatch(filterPost(postId));
        }
        return response;
    } catch (error) {
        return error.response;
    }
};

export const approvePost = (token, postId) => async (dispatch) => {
    try {
        const response = await axios.put(`${process.env.API_URL}posts/approve/${postId}`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            dispatch(filterPost(postId));
        }
        return response;
    } catch (error) {
        return error.response;
    }
};

export const ignoreReports = (token, postId) => async (dispatch) => {
    try {
        const response = await axios.put(`${process.env.API_URL}posts/ignore-reports/${postId}`, null, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            dispatch(filterPost(postId));
        }
        return response;
    } catch (error) {
        return error.response;
    }
};