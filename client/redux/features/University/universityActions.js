import axios from 'axios';
import { setApprovedUniversities } from './universitySlice';

export const registerUniversity = (universityData) => async (dispatch) => {
  try {
    const response = await axios.post(`${process.env.API_URL}university/register`, universityData);
    return response
  } catch (error) {
    return error.response;
  }
};

export const getApprovedUniversities = () => async (dispatch) => {
  try {
    const response = await axios.get(`${process.env.API_URL}university/approved`);
    dispatch(setApprovedUniversities(response.data))
    return response
  } catch (error) {
    return error.response;
  }
}