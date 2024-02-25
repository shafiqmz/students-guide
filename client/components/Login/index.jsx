'use client';
import React, { useEffect } from 'react';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import { useState } from 'react';
import { Signup } from './../Signup';
import Image from 'next/image';
import { RegisterUniversity } from '../RegisterUniversity';
import { ForgotPassword } from './../ForgotPassword';
import {
  getLoggedInUserInfo,
  loginUser,
} from '@/redux/features/User/userActions';
import Loading from '../General/Loading';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import UserExistsLottie from '../General/UserExistsLottie';
import ErrorLottie from '../General/ErrorLottie';
import { CreateJob } from '../CreateJob';

export const Login = () => {
  const dispatch = useDispatch();
  const { push } = useRouter();
  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email('Invalid email address')
      .required('Email is required'),
    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const [open, setOpen] = useState(false);
  const [openRegisterUniversity, setOpenRegisteruniversity] = useState(false);
  const [openCreateJob, setOpenCreateJob] = useState(false);
  const [openForgotPasswordDialog, setOpenForgotPasswordDialog] =
    useState(false);
  const [errorType, setErrorType] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      push('/home');
    }
  }, []);

  return (
    <div className='bg-main h-screen w-screen flex flex-col md:flex-row justify-center items-center'>
      <Image
        src='/Logo/default.png'
        alt='Students Guide'
        width={500}
        height={200}
        className='my-[-150px] md:w-[400px] lg:w-[500px] xl:w-[600px]'
      />
      <div className='flex flex-col justify-center'>
        {loading ? (
          <div className='bg-white shadow-custom mt-12 xs:mt-0 w-11/12 md:w-11/12 lg:w-4/5 lg:ml-16 md:mr-4 flex flex-col p-6 rounded-lg self-center'>
            <div className='flex flex-col justify-center'>
              <Loading height={200} />
            </div>
          </div>
        ) : errorType && errorType === 'Invalid Credentials' ? (
          <div className='bg-white shadow-custom mt-12 xs:mt-0 w-11/12 md:w-11/12 lg:w-4/5 lg:ml-16 md:mr-4 flex flex-col p-6 rounded-lg self-center'>
            <div className='flex flex-col justify-center'>
              <UserExistsLottie height={200} />
              <h4 className='font-semibold'>Invalid Credentials.</h4>

              <p className='font-thin text-sm text-primaryBlue'>
                Looks like your email or password is wrong. Forgot password or
                register yourself first.
              </p>
              <button
                className='w-full bg-secondaryOrange hover:bg-primaryBlue transition-all text-white rounded-md h-10  mt-5'
                onClick={() => {
                  setErrorType();
                  setLoading(false);
                }}
              >
                Retry
              </button>
              <hr />
              <p
                className='text-center text-inputColor my-4 transition-all hover:text-primaryBlue cursor-pointer hover:underline'
                onClick={() => setOpenForgotPasswordDialog(true)}
              >
                Forgotten password?
              </p>
              <hr />
              <button
                className='px-6 mx-auto bg-lightBlue transition-all hover:bg-lightOrange hover:text-secondaryOrange text-blue-600 rounded-md h-12 text-lg mt-5'
                onClick={() => setOpen(true)}
              >
                Sign up
              </button>
            </div>
          </div>
        ) : errorType === 'Not Verified' ? (
          <div className='bg-white shadow-custom mt-12 xs:mt-0 w-11/12 md:w-11/12 lg:w-4/5 lg:ml-16 md:mr-4 flex flex-col p-6 rounded-lg self-center'>
            <div className='flex flex-col justify-center'>
              <ErrorLottie height={200} />
              <h4 className='mt-2 font-semibold'>
                Your account has not been verified yet.
              </h4>
              <p className='mt-1 font-thin text-sm text-primaryBlue'>
                Kindly wait until your account is verified by the management.
                You'll recieve an email once you are registered and ready to go.
              </p>
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
          <div className='bg-white shadow-custom mt-12 xs:mt-0 w-11/12 md:w-11/12 lg:w-4/5 lg:ml-16 md:mr-4 flex flex-col p-6 rounded-lg self-center'>
            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              validationSchema={LoginSchema}
              onSubmit={(values) => {
                setLoading(true);
                dispatch(loginUser(values)).then((res) => {
                  const type =
                    res?.status === 401
                      ? 'Invalid Credentials'
                      : res?.status === 403
                      ? 'Not Verified'
                      : res?.status === 200
                      ? 'Ok'
                      : 'Internal Server';
                  if (type === 'Ok') {
                    dispatch(getLoggedInUserInfo(res.token));
                    if (res.data.firstLogin) {
                      push('/change-password')
                    } else if (res.data.role === "Superadmin") {
                      push('/home/dashboard');
                    } else {
                      push('/home');
                    }
                  }
                  setErrorType(type);
                  setLoading(false);
                });
              }}
            >
              {({ errors, touched }) => (
                <Form>
                  <Field
                    name='email'
                    type='email'
                    placeholder='Email'
                    className={`w-full border ${
                      errors.email && touched.email
                        ? 'border-red-600'
                        : 'border-custom'
                    } border-custom rounded-md h-12 text-lg py-6 px-3 focus:outline-primaryBlue  focus:shadow-lg`}
                  />
                  {errors.email && touched.email ? (
                    <div className='text-end text-xs text-red-600 mt-1'>
                      {errors.email}
                    </div>
                  ) : null}
                  <Field
                    name='password'
                    type='password'
                    placeholder='Password'
                    className={`w-full border border-custom rounded-md h-12 text-lg py-6 px-3 mt-4 focus:outline-primaryBlue  focus:shadow-lg ${
                      errors.password && touched.password
                        ? 'border-red-600'
                        : 'border-custom'
                    }`}
                  />
                  {errors.password && touched.password ? (
                    <div className='text-end text-xs text-red-600 mt-1'>
                      {errors.password}
                    </div>
                  ) : null}
                  <button
                    type='submit'
                    className='w-full bg-primaryBlue hover:bg-secondaryOrange transition-all text-white rounded-md h-12 text-xl  mt-5'
                  >
                    Log in
                  </button>
                </Form>
              )}
            </Formik>

            <p
              className='text-center text-inputColor my-4 transition-all hover:text-primaryBlue cursor-pointer hover:underline'
              onClick={() => setOpenForgotPasswordDialog(true)}
            >
              Forgotten password?
            </p>
            <hr />
            <button
              className='px-6 mx-auto bg-lightBlue transition-all hover:bg-lightOrange hover:text-secondaryOrange text-blue-600 rounded-md h-12 text-lg mt-5'
              onClick={() => setOpen(true)}
            >
              Sign up
            </button>

            <Signup open={open} onClose={() => setOpen(false)} />
          </div>
        )}

        <p className='lg:ml-16 self-center mt-4 text-sm font-thin md:mr-4 w-11/12 md:w-11/12 lg:w-4/5'>
          If your University doesn't exist in the list, you can{' '}
          <span
            className='font-semibold text-primaryBlue cursor-pointer hover:underline hover:text-secondaryOrange'
            onClick={() => setOpenRegisteruniversity(true)}
          >
            register univeristy
          </span>{' '}
          here or <span
            className='font-semibold text-primaryBlue cursor-pointer hover:underline hover:text-secondaryOrange'
            onClick={() => setOpenCreateJob(true)}
          >
            hire a candidate
          </span>{' '}
          here
        </p>
      </div>
      
      <RegisterUniversity
        open={openRegisterUniversity}
        onClose={() => setOpenRegisteruniversity(false)}
      />
      <ForgotPassword
        open={openForgotPasswordDialog}
        onClose={() => setOpenForgotPasswordDialog(false)}
      />
      <CreateJob
        open={openCreateJob}
        onClose={() => setOpenCreateJob(false)}
      />
    </div>
  );
};
