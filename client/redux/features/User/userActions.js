import axios from 'axios';
import { setFirstLoginToFalse, setLoggedInUserInfo, setRecommendedCourses } from './userSlice';
import fetchPlaylistsForInterests from '@/utils/fetchRecommendedYouTubeVideos';

export const registerUser = (userData) => async (dispatch) => {
  try {
    const response = await axios.post(`${process.env.API_URL}user`, userData);
    return response;
  } catch (error) {
    return error.response;
  }
};

export const loginUser = (credentials) => async (dispatch) => {
  try {
    const response = await axios.post(
      `${process.env.API_URL}user/login`,
      credentials
    );
    if (response.status === 200) {
      dispatch(setLoggedInUserInfo(response.data));
    }
    return response;
  } catch (error) {
    return error.response;
  }
};

export const getLoggedInUserInfo = (token) => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.API_URL}user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      dispatch(setLoggedInUserInfo(response.data));
    }
    return response;
  } catch (error) {
    return error.response;
  }
};

export const updateUserProfile = (token, params, id) => (dispatch) => {
  return new Promise(async (resolve, reject) => {
    try {
      const response = await axios.put(
        `${process.env.API_URL}user/profile/${id}`,
        params,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        dispatch(setLoggedInUserInfo(response.data));
      }

      resolve(response);
    } catch (error) {
      reject(error.response);
    }
  });
};

export const changePassword = (token, params) => async (dispatch) => {
  try {
    const response = await axios.put(
      `${process.env.API_URL}user/change-password`,
      params,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.status === 200) {
      dispatch(setFirstLoginToFalse());
    }
    return response;
  } catch (error) {
    return error.response;
  }
};

export const fetchRecommendedCourses = (interests) => (dispatch) => {
  return new Promise((resolve, reject) => {
    fetchPlaylistsForInterests(interests)
      .then((result) => {
        dispatch(setRecommendedCourses(result));
        resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
};
