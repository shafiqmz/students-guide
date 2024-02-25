"use client"

import React from 'react'
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { useDispatch, useSelector } from 'react-redux';
import { changePassword, getLoggedInUserInfo } from '@/redux/features/User/userActions';
import NotAuthorized from '@/components/General/NotAuthorized';
import PageLoader from '@/components/General/PageLoader';
import Loading from '@/components/General/Loading';
import ServerErrorLottie from '@/components/General/ServerErrorLottie';
import UserExistsLottie from '@/components/General/UserExistsLottie';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/Navbar';

const page = () => {
  const dispatch = useDispatch();
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [errorType, setErrorType] = useState()
  const { push } = useRouter();

  useEffect(() => {
    if (!JSON.parse(localStorage.getItem('token'))) {
      setIsNotAuthorized(true);
    }
  }, []);

  const ChangePasswordSchema = Yup.object().shape({
    currentPassword: Yup.string()
      .required('Current Password is required'),

    newPassword: Yup.string()
      .matches(
        /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
        'Password must contain at least 8 characters, one uppercase, one number and one special case character'
      )
      .required('New Password is required'),

    retypePassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
      .required('Retype Password is required'),
  });

  return (
    <>
      <Navbar />
      <div className="flex justify-center items-center w-screen h-screen bg-main">

        {pageLoading ? <PageLoader /> :
          <div className="w-4/5 sm:w-3/4 lg:w-3/6 shadow-lg pb-6 bg-white rounded-2xl px-4 sm:px-8 ">
            <h3 className='my-7 pb-4 border-b-2 border-primaryBlue text-primaryBlue font-semibold text-2xl'>
              Change Password
            </h3>
            {loading ? (
              <div className='bg-white shadow-custom mt-12 xs:mt-0 w-11/12 md:w-11/12 lg:w-4/5 lg:ml-16 md:mr-4 flex flex-col p-6 rounded-lg self-center'>
                <div className='flex flex-col justify-center'>
                  <Loading height={250} />
                </div>
              </div>
            ) : errorType && errorType === 'Invalid Credentials' ? (
              <div className='mt-12 xs:mt-0 w-11/12 md:w-11/12 lg:w-4/5 lg:ml-16 md:mr-4 flex flex-col p-6 rounded-lg self-center'>
                <div className='flex flex-col justify-center'>
                  <UserExistsLottie height={250} />
                  <h4 className='font-semibold'>Current Password doesn't match</h4>
                  <button
                    className='w-full bg-secondaryOrange hover:bg-primaryBlue transition-all text-white rounded-md h-10  mt-5'
                    onClick={() => {
                      setErrorType();
                      setLoading(false);
                    }}
                  >
                    Retry
                  </button>
                </div>
              </div>
            ) : errorType === 'Internal Server' ? (
              <div className='mt-12 xs:mt-0 w-11/12 md:w-11/12 lg:w-4/5 lg:ml-16 md:mr-4 flex flex-col p-6 rounded-lg self-center'>
                <div className='flex flex-col justify-center'>
                  <ServerErrorLottie height={200} />
                  <h4 className='mt-2 font-semibold'>
                    Internal Server Error
                  </h4>
                </div>
                <button
                  className='w-full bg-secondaryOrange hover:bg-primaryBlue transition-all text-white rounded-md h-10  mt-5'
                  onClick={() => {
                    setErrorType();
                    setLoading(false);
                  }}
                >
                  Retry
                </button>
              </div>
            ) : (
              <Formik
                initialValues={{
                  currentPassword: '',
                  newPassword: '',
                  retypePassword: '',
                }}
                validationSchema={ChangePasswordSchema}
                onSubmit={(values) => {
                  const params = {
                    currentPassword: values.currentPassword,
                    newPassword: values.newPassword
                  }

                  setLoading(true);
                  dispatch(changePassword(JSON.parse(localStorage.getItem('token')), params)).then((res) => {
                    const type =
                      res.status === 401
                        ? 'Invalid Credentials'
                        : res.status === 200
                          ? 'Ok'
                          : 'Internal Server';
                    if (type === 'Ok') {
                      push('/home');
                    }
                    setErrorType(type);
                    setLoading(false);
                  }).catch(error => setLoading(false));
                }}
              >
                {({ errors, values, handleChange }) => (
                  <Form>
                    <TextField
                      name='currentPassword'
                      label='Current Password'
                      required
                      value={values.currentPassword}
                      onChange={handleChange}
                      fullWidth
                      type="password"
                      error={!!errors.currentPassword}
                      helperText={errors.currentPassword}
                    />
                    <TextField
                      name='newPassword'
                      label='New Password'
                      required
                      value={values.newPassword}
                      onChange={handleChange}
                      fullWidth
                      type="password"
                      error={!!errors.newPassword}
                      helperText={errors.newPassword}
                      sx={{ marginTop: "8px" }}
                    />
                    <TextField
                      name='retypePassword'
                      label='Re-type Password'
                      required
                      value={values.retypePassword}
                      onChange={handleChange}
                      fullWidth
                      type="password"
                      error={!!errors.retypePassword}
                      helperText={errors.retypePassword}
                      sx={{ marginTop: "8px" }}
                    />
                    <button
                      type='submit'
                      className='w-full bg-primaryBlue hover:bg-secondaryOrange transition-all text-white rounded-md h-12 text-md xs:text-lg sm:text-xl  mt-5'
                    >
                      Change Password
                    </button>
                  </Form>
                )}
              </Formik>
            )}
          </div>
        }
        <NotAuthorized height={250} open={isNotAuthorized} onClose={() => setIsNotAuthorized(false)} />
      </div>
    </>
  )
}

export default page