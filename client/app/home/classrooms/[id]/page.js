'use client';

import React, { useState, useEffect } from 'react';
import WritePost from './../../../../components/Post/WritePost';
import ShowPost from '@/components/Post/ShowPost';
import SentForVerificationLottie from './../../../../components/General/SentForVerificationLottie';
import { useSelector } from 'react-redux';
import PeopleList from './Components/PeopleList';
import useGetRole from '@/components/General/CustomHooks/useGetRole';
import Announcements from './Components/Announcements';
import Assignments from './Components/Assignments';
import PostApproval from './Components/PostApproval';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import PageLoader from '@/components/General/PageLoader';
import ErrorDialog from './../join/[id]/ErrorDialog';

const page = ({ params }) => {
  const { id } = params;
  const [activeKey, setActiveKey] = useState(0);
  const [loading, setLoading] = useState(false);
  const userInfo = useSelector(state => state.user.userInfo)
  const role = useGetRole();
  const token = JSON.parse(localStorage.getItem("token"))
  const { enqueueSnackbar } = useSnackbar();
  const [openErrorDialog, setOpenErrorDialog] = useState(false)
  const [classroomUsers, setClassroomUsers] = useState([])

  useEffect(() => {
    checkIsUserApproved()
    fetchClassroomUsers();
  }, [])

  const checkIsUserApproved = () => {
    setLoading(true)
    axios.get(`${process.env.API_URL}classroom/is-user-approved/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const approved = res.data.isApproved;
        console.log(approved)
        setOpenErrorDialog(!approved);
      })
      .catch(err => {
        enqueueSnackbar("Something went wrong while fetching user data", { variant: "error" })
        return false;
      }).finally(() => {
      })
  }

  const fetchClassroomUsers = () => {
    setLoading(true)
    axios.get(`${process.env.API_URL}classroom/members/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        const classroomData = res.data;
        const isUserInClassroom = classroomData.students.some(student => student._id === userInfo?._id) ||
          (classroomData.teacher && classroomData.teacher._id === userInfo?._id);
        if (isUserInClassroom) {
          setClassroomUsers(classroomData)
        } else {
          setOpenErrorDialog(true)
        }
      })
      .catch(err => {
        enqueueSnackbar("Something went wrong while fetching user data", { variant: "error" })
      }).finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      {
        loading ? <PageLoader /> : !openErrorDialog && <div className='px-2 md:px-8 lg:px-20 pb-20 pt-4 h-screen overflow-y-auto overflow-x-hidden'>
          <div className='flex flex-wrap gap-3 items-center mb-12'>
            <button
              onClick={() => setActiveKey(0)}
              className={`mr-2 rounded-md outline-none transition px-4 py-2 ${activeKey === 0
                ? 'border-b-4 border-secondaryOrange font-semibold'
                : 'hover:bg-mainHover'
                }`}
            >
              Announcements
            </button>
            <button
              onClick={() => setActiveKey(1)}
              className={`mr-2 rounded-md outline-none transition px-4 py-2 ${activeKey === 1
                ? 'border-b-4 border-secondaryOrange font-semibold'
                : 'hover:bg-mainHover'
                }`}
            >
              Assignments
            </button>
            <button
              onClick={() => setActiveKey(2)}
              className={`mr-2 rounded-md outline-none transition px-4 py-2 ${activeKey === 2
                ? 'border-b-4 border-secondaryOrange font-semibold'
                : 'hover:bg-mainHover'
                }`}
            >
              People
            </button>
            {
              role === 'Teacher' && <button
                onClick={() => setActiveKey(3)}
                className={`mr-2 rounded-md outline-none transition px-4 py-2 ${activeKey === 3
                  ? 'border-b-4 border-secondaryOrange font-semibold'
                  : 'hover:bg-mainHover'
                  }`}
              >
                Post Approval
              </button>
            }

          </div>
          {activeKey === 0 ? (
            <Announcements id={id} />
          ) : activeKey === 1 ? (
            <Assignments id={id} role={userInfo?.role} />
          ) : activeKey === 2 ? (
            <>
              <PeopleList classroomUsers={classroomUsers} id={id} fetchClassroomUsers={fetchClassroomUsers} />
            </>
          ) : activeKey === 3 ? (
            <PostApproval id={id} />
          ) : null}
        </div>
      }
      <ErrorDialog open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} errorCode={402} />
    </>
  );
};

export default page;
