'use client';

import useGetRole from '@/components/General/CustomHooks/useGetRole';
import NotAuthorized from '@/components/General/NotAuthorized';
import {
  fetchRecommendedCourses,
  updateUserProfile,
} from '@/redux/features/User/userActions';
import {
  setRecommendedCourses
} from '@/redux/features/User/userSlice';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecommendationCard from './Components/RecommendationCard';
import { Chip } from '@mui/material';
import ClearIcon from '@mui/icons-material/HighlightOffRounded';
import PageLoader from '@/components/General/PageLoader';
import offlineData from './offlineData.json'

const page = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [interest, setInterest] = useState('');
  const [interestsArray, setInterestsArray] = useState(userInfo?.interests);
  const recommendedCourses = useSelector(
    (state) => state.user.recommendedCourses
  );
  const dispatch = useDispatch();
  const [recommendationLoading, setRecommendationLoading] = useState(false);
  const role = useGetRole();
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);

  useEffect(() => {
    if (!userInfo?._id || role !== 'Student') {
      setIsNotAuthorized(true);
      return;
    }
    if (!navigator.onLine) {
      const resultObj = offlineData;
      dispatch(setRecommendedCourses(resultObj));
      return;
    }
    setRecommendationLoading(true);
    if (recommendedCourses.length === 0) {
      dispatch(fetchRecommendedCourses(userInfo?.interests))
        .then(() => setRecommendationLoading(false))
        .catch(() => setRecommendationLoading(false));
    } else {
      setRecommendationLoading(false)
    }
  }, []);

  const addItem = () => {
    const trimmedInterest = interest.trim();
    if (trimmedInterest !== '' && !interestsArray.includes(trimmedInterest)) {
      const updatedArr = [...interestsArray, trimmedInterest];
      setInterestsArray(updatedArr);
      setInterest('');
      setRecommendationLoading(true);
      dispatch(
        updateUserProfile(JSON.parse(localStorage.getItem('token',)), {
          interests: updatedArr,
        }, userInfo._id)
      ).then((res) => {
        dispatch(fetchRecommendedCourses(res?.data?.interests))
          .then(() => setRecommendationLoading(false))
          .catch(() => setRecommendationLoading(false));
      });
    }
  };

  const removeItem = (itemToRemove) => {
    const updatedArray = interestsArray.filter(
      (interest) => interest !== itemToRemove
    );
    setInterestsArray(updatedArray);
    dispatch(
      updateUserProfile(JSON.parse(localStorage.getItem('token')), {
        interests: updatedArray,
      }, userInfo._id)
    ).then((res) => {
      dispatch(fetchRecommendedCourses(res?.data?.interests));
    });
  };

  return (
    <div className='h-screen pb-20 overflow-y-auto'>
      <div className='flex flex-col m-8'>
        <input
          name='interests'
          placeholder='Enter your interests'
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              addItem('interest');
            }
          }}
          className='bg-transparent outline-none py-6 '
        />
        <div className='flex flex-wrap mt-2'>
          {interestsArray.map((interest, index) => (
            <Chip
              key={index}
              label={interest}
              onDelete={() => removeItem(interest, 'interest')}
              className='bg-primaryBlue text-white mr-1 mt-2'
              deleteIcon={<ClearIcon style={{ color: 'white' }} />}
            />
          ))}
        </div>
      </div>
      {recommendationLoading ? (
        <PageLoader />
      ) : (
        <>
          <h2 className='text-2xl ml-8'>{`${
            recommendedCourses
              ? recommendedCourses.length > 0
                ? 'Here are recommended courses, just for you'
                : 'We are not familiar with your interests. Add your interests, so that we can recommended courses for you.'
              : null
          }`}</h2>
          {recommendedCourses && recommendedCourses.length > 0 && (
            <div className='p-2 sm:p-3 md:p-4 flex justify-center items-center flex-wrap'>
              {recommendedCourses.map((recommendation, index) => (
                <RecommendationCard
                  key={index}
                  recommendation={recommendation}
                />
              ))}
            </div>
          )}
        </>
      )}

      <NotAuthorized
        height={250}
        open={isNotAuthorized}
        onClose={() => setIsNotAuthorized(false)}
      />
    </div>
  );
};

export default page;
