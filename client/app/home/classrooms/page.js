"use client"

import useGetRole from '@/components/General/CustomHooks/useGetRole';
import NotAuthorized from '@/components/General/NotAuthorized';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import ClassRoomCard from './Components/ClassRoomCard';
import { BiPlus } from "@react-icons/all-files/bi/BiPlus"
import CreateClass from './[id]/Components/CreateClass';
import { useSnackbar } from 'notistack';
import axios from 'axios';
import PageLoader from '@/components/General/PageLoader';
import NoDataLottie from '@/components/General/NoDataLottie';

const page = () => {
  const role = useGetRole();
  const userInfo = useSelector((state) => state.user.userInfo);
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [classrooms, setClassrooms] = useState([])
  const token = JSON.parse(localStorage.getItem("token"));
  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (!userInfo?._id || !(role === 'Student' || role === 'Teacher')) {
      setIsNotAuthorized(true);
      return;
    } else {
      fetchClassrooms();
    }
  }, []);

  const fetchClassrooms = () => {
    setLoading(true)
    axios.get(`${process.env.API_URL}classroom/all`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setClassrooms(res.data)
        setLoading(false)
      }).catch(err => {
        enqueueSnackbar("Unable to fetch data at the moment", { variant: "error" })
        setLoading(false)
      })
  }

  return (
    <div className="h-screen overflow-y-auto">
      {
        role === "Teacher" && (
          <div className="flex w-full mb-[-28px]">
            <button onClick={() => setShowCreateModal(true)} className="ml-auto mr-auto sm:mr-5 mt-5 font-semibold text-white bg-secondaryOrange px-4 py-2 rounded-3xl hover:bg-lightOrange transition-all flex items-center text-md md:text-lg">
              <BiPlus className="text-xl" />
              <p className="ml-1">Create Classroom</p>
            </button>
          </div>
        )
      }
      {
        !loading ? <div className="flex flex-wrap m-8 md:mx-20 mb-20 ">
          {
            classrooms && classrooms.length > 0 ? classrooms.map((classroom) => (
              <ClassRoomCard key={classroom.classroomId} classroom={classroom} />
            )) : <NoDataLottie message={"No classrooms yet."} height={400} />
          }
        </div> : <PageLoader />
      }

      <NotAuthorized
        height={250}
        open={isNotAuthorized}
        onClose={() => setIsNotAuthorized(false)}
      />
      <CreateClass open={showCreateModal} onClose={() => setShowCreateModal(false)} fetchClassrooms={fetchClassrooms} />
    </div>
  )
}

export default page