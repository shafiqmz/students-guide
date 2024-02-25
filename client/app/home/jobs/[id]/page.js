'use client';

import React, { useState, useEffect } from 'react';
import { BiBuildings } from '@react-icons/all-files/bi/BiBuildings';
import { TiLocationOutline } from '@react-icons/all-files/ti/TiLocationOutline';
import { FaNetworkWired } from '@react-icons/all-files/fa/FaNetworkWired';
import { BsPeople } from '@react-icons/all-files/bs/BsPeople';
import { CgDarkMode } from '@react-icons/all-files/cg/CgDarkMode';
import { Tooltip } from '@mui/material';
import axios from "axios";
import { useSnackbar } from "notistack"
import PageLoader from "../../../../components/General/PageLoader.jsx"
import { useSelector } from 'react-redux';
import SmallSpinnerLoader from './../../../../components/General/SmallSpinnerLoader';
import ReactHtmlParser from 'react-html-parser';

const JobDescription = ({ params }) => {
  const { id } = params;
  const userId = useSelector(state => state.user.userInfo._id);
  const [jobDetail, setJobDetail] = useState();
  const token = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem("token")) : null;
  const [savedJob, setSavedJob] = useState()
  const { enqueueSnackbar } = useSnackbar()
  const [loading, setLoading] = useState(false)
  const [saveLoading, setSaveLoading] = useState(false)

  const handleToggleSaveJob = () => {
    setSaveLoading(true)
    axios.put(`${process.env.API_URL}jobs/save/${id}`, null, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => {
      if (res?.status === 200) {
        setSavedJob(prevSavedJob => !prevSavedJob)
      } else {
        enqueueSnackbar("Something went wrong while saving", { variant: "error" })
      }
    }).catch((err) => {
      enqueueSnackbar("Something went wrong while saving", { variant: "error" })
    }).finally(() => setSaveLoading(false))
  }

  useEffect(() => {
    fetchJobDetail();
  }, [])

  useEffect(() => {
    const userIdExists = jobDetail?.savedBy?.includes(userId)
    if (userIdExists !== undefined) {
      setSavedJob(userIdExists);
    }
  }, [jobDetail])

  const fetchJobDetail = () => {
    setLoading(true)
    axios.get(`${process.env.API_URL}jobs/${id}`).then(res => {
      if (res?.status === 200) {
        setJobDetail(res?.data)
      } else {
        enqueueSnackbar("Something went wrong", { variant: "error" })
      }
    }).catch((err) => {
      enqueueSnackbar("Something went wrong", { variant: "error" })
    }).finally(() => setLoading(false))
  }

  return (
    <>
      {
        !loading ? <div className='px-8 md:px-12 lg:px-20 py-12 pb-24 flex flex-col h-screen overflow-y-auto'>
          <div className="flex flex-col bg-white rounded-2xl p-4 shadow-lg">
            <h3 className='text-primaryBlue font-semibold text-lg sm:text-xl md:text-2xl'>
              {jobDetail?.jobTitle}
            </h3>
            <div className='flex items-center mt-4'>
              <BiBuildings className='mr-2 text-secondaryOrange' />
              <Tooltip enterDelay={1500} title='Company'>
                <p className='text-sm md:text-md text-bgContrast font-medium cursor-default'>
                  {jobDetail?.companyName}
                </p>
              </Tooltip>
            </div>
            <div className='flex items-center mt-4'>
              <BsPeople className='mr-2 text-secondaryOrange' />
              <Tooltip enterDelay={1500} title='Company Size'>
                <p className='text-sm md:text-md text-bgContrast font-medium cursor-default'>
                  {`${jobDetail?.range[0]} - ${jobDetail?.range[1]}`}
                </p>
              </Tooltip>
            </div>
            <div className='flex items-center mt-4'>
              <CgDarkMode className='mr-2 text-secondaryOrange' />
              <Tooltip enterDelay={1500} title='Job Mode'>
                <p className='text-sm md:text-md text-bgContrast font-medium cursor-default'>
                  {jobDetail?.mode}
                </p>
              </Tooltip>
            </div>
            <div className='flex items-center mt-4'>
              <FaNetworkWired className='mr-2 text-secondaryOrange' />
              <Tooltip enterDelay={1500} title='Job Type'>
                <p className='text-sm md:text-md font-semibold cursor-default px-2 py-1 bg-secondaryOrange rounded-md text-white'>
                  {jobDetail?.type}
                </p>
              </Tooltip>
            </div>
            <div className='flex items-center justify-between mt-5'>
              {
                savedJob !== undefined ? <button
                  className={`p-2 md:p-3 md:py-2 ${savedJob
                    ? 'bg-secondaryOrange hover:bg-lightOrange'
                    : 'bg-primaryBlue hover:bg-lightBlue'
                    } transition-all text-white rounded-3xl text-xs sm:text-sm md:text-md flex items-center px-4`}
                  onClick={handleToggleSaveJob}
                >
                  {saveLoading && <SmallSpinnerLoader />}
                  <p className={`${saveLoading && "ml-2"}`}>{savedJob ? 'Unsave' : 'Save Job'}</p>
                </button> : <div></div>
              }

              <div className='flex items-center ml-auto'>
                <TiLocationOutline className='mr-1 text-secondaryOrange' />
                <p className='text-xs sm:text-sm md:text-md text-bgContrast font-medium'>
                  {jobDetail?.location}
                </p>
              </div>
            </div>
          </div>
          <h3 className='my-7 pb-4 border-b-2 border-primaryBlue text-primaryBlue font-semibold text-2xl'>Job Description</h3>
          <p className="text-black font-medium">
            {ReactHtmlParser(jobDetail?.jobDescription)}
          </p>
          <div className="border-t-2 mt-8 border-secondaryOrange pt-2 flex items-center">
            <p className='font-medium'>Send your resume at <a
              href="mailto:hr@paysyslabs.com"
              className="font-semibold text-secondaryOrange hover:underline transition-all cursor-pointer"
            >
              {jobDetail?.contactEmail}
            </a></p>
          </div>
        </div>
          : <PageLoader />
      }
    </>
  );
};

export default JobDescription;
