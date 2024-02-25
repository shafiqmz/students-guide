'use client';

import React, { useEffect, useState } from 'react';
import { BiBuildings } from '@react-icons/all-files/bi/BiBuildings';
import { TiLocationOutline } from '@react-icons/all-files/ti/TiLocationOutline';
import Link from 'next/link';
import axios from 'axios';
import PageLoader from '@/components/General/PageLoader';
import { CreateJob } from '@/components/CreateJob/index';
import NoDataLottie from '@/components/General/NoDataLottie';
import { MenuItem, TextField } from '@mui/material';
import SmallSpinnerLoader from '@/components/General/SmallSpinnerLoader';
import Navbar from '@/components/Navbar';
import { formatDistanceToNow } from 'date-fns';
import ServerErrorLottie from '@/components/General/ServerErrorLottie';

const page = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadMoreLoading, setLoadMoreLoading] = useState(false);
  const [error, setError] = useState(false);
  const [openCreateJob, setOpenCreateJob] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [filters, setFilters] = useState({
    location: '',
    mode: '',
    type: '',
    daysAgo: ''
  });

  const jobType = [
    { label: 'All', value: '' },
    { label: 'Internship', value: 'Internship' },
    { label: 'Part-Time', value: 'Part-Time' },
    { label: 'Full-Time', value: 'Full-Time' },
  ];

  const jobMode = [
    { label: 'All', value: '' },
    { label: 'Remote', value: 'Remote' },
    { label: 'Hybrid', value: 'Hybrid' },
    { label: 'On-site', value: 'On-site' },
  ];

  const daysAgo = [
    { label: 'All', value: '' },
    { label: 'Today', value: '1' },
    { label: 'Last Week', value: '7' },
    { label: 'Last Month', value: '30' },
  ];

  useEffect(() => {
    setLoading(true);
    const apiUrl = `${process.env.API_URL}jobs`;
    const filteredApiUrl = `${apiUrl}?location=${filters.location}&type=${filters.type
      }&mode=${filters.mode}&daysAgo=${filters.daysAgo}&pageSize=10&page=${1}`;
    axios
      .get(filteredApiUrl)
      .then((res) => {
        setJobs(res.data?.jobs);
        setHasMore(res?.data?.jobs?.length < 9 ? false : true);
        setLoading(false);
      })
      .catch((error) => {
        setError(true);
        setLoading(false);
      });
  }, [filters.location, filters.type, filters.mode, filters.daysAgo, openCreateJob]);

  const loadMore = () => {
    setLoadMoreLoading(true);
    const apiUrl = `${process.env.API_URL}jobs`;
    const filteredApiUrl = `${apiUrl}?location=${filters.location}&type=${filters.type
    }&mode=${filters.mode}&daysAgo=${filters.daysAgo}&pageSize=10&page=${page + 1}`;
    setPage((prevPage) => prevPage + 1);
    axios
      .get(filteredApiUrl)
      .then((res) => {
        setJobs(prevJobs => [...prevJobs, ...res.data?.jobs]);
        setHasMore(res?.data?.jobs?.length < 9 ? false : true);
        setLoadMoreLoading(false);
      })
      .catch((error) => {
        setError(true);
        setLoadMoreLoading(false);
      });
  };

  return (
    <>
      <Navbar />
      <div className='h-screen overflow-y-auto pt-8'>
        <button
          className='bg-secondaryOrange px-2 py-1 sm:px-3 sm:py-2 md:px-4 md:py-3 absolute right-0 top-[80px] rounded-3xl ml-auto mr-8 text-white text-semibold'
          onClick={() => setOpenCreateJob(true)}
        >
          Create Job
        </button>

        <div className='flex flex-wrap gap-2 sm:items-center mt-[70px] ml-4 sm:ml-[40px]'>
          <TextField
            name='location'
            label='location'
            value={filters.location}
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className=' w-48'
          />
          <TextField
            select
            name='type'
            label='type'
            value={filters.type}
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className=' w-32'
          >
            {jobType.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            name='mode'
            label='mode'
            value={filters.mode}
            onChange={(e) => setFilters({ ...filters, mode: e.target.value })}
            className=' w-32'
          >
            {jobMode.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            select
            name='time'
            label='daysAgo'
            value={filters.daysAgo}
            onChange={(e) => setFilters({ ...filters, daysAgo: e.target.value })}
            className=' w-32'
          >
            {daysAgo.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
        </div>

        {loading ? (
          <PageLoader />
        ) : error ? (
          <ServerErrorLottie height={300} message={'Something Went Wrong'} />
        ) : jobs?.length === 0 ? (
          <NoDataLottie height={300} message={'No Jobs Found'} />
        ) : (
          <div className='flex flex-col items-center pb-20'>
            {jobs?.map((job, index) => {
              return (
                <div
                  className='w-11/12 xs:w-10/12 md:w-3/4 flex flex-col bg-white shadow-lg rounded-lg p-3 md:p-4 lg:p-6 mt-5'
                  key={index}
                >
                  <Link
                    href={`jobs/${job._id}`}
                    className='text-primaryBlue font-semibold text-md sm:text-xl md:text-2xl cursor-pointer hover:underline'
                  >
                    {job?.jobTitle}
                  </Link>
                  <div className='flex items-center mt-2'>
                    <BiBuildings className='mr-1 text-secondaryOrange' />
                    <p className='text-sm md:text-md text-bgContrast font-medium'>
                      {job?.companyName}
                    </p>
                  </div>
                  <div className='flex items-center justify-between mt-3'>
                    {job && job.timestamp && <p>{formatDistanceToNow(new Date(job.timestamp))} ago</p>}
                      <div className="flex items-center">
                      <TiLocationOutline className='mr-1 text-secondaryOrange' />
                      <p className='text-xs sm:text-sm md:text-md text-bgContrast font-medium'>
                        {job?.location}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
            {hasMore ? (
              <button
                onClick={loadMore}
                className='mt-4 mx-auto py-2 px-4 bg-primaryBlue hover:bg-lightBlue hover:text-textColor text-white rounded-md flex items-center'
              >
                {loadMoreLoading && <SmallSpinnerLoader />}{' '}
                <p className={`${loadMoreLoading && 'ml-2'}`}>Load More</p>
              </button>
            ) : (
              <p className='mt-4 flex justify-center'>🙌 You're all caught up.</p>
            )}
          </div>
        )}

        <CreateJob open={openCreateJob} onClose={() => setOpenCreateJob(false)} />
      </div>
    </>
  );
};

export default page;
