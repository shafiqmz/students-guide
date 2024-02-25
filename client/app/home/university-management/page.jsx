"use client"

import React from 'react'
import UniversityList from './Components/UniversityList'
import useGetRole from '@/components/General/CustomHooks/useGetRole'
import NotAuthorized from '@/components/General/NotAuthorized'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { useEffect } from 'react'

const page = () => {
    const role = useGetRole();
    const userInfo = useSelector(state => state.user.userInfo)
    const [isNotAuthorized, setIsNotAuthorized] = useState(false);

    useEffect(() => {
        if (!userInfo?._id && !(role === "Superadmin")) {
          setIsNotAuthorized(true);
          return;
        }
      }, []);    

    return (
        <div className='flex flex-col pr-2 xs:px-6 sm:px-8 md:px-12 lg:px-20 pt-12 py-20 h-screen overflow-y-auto'>
            <UniversityList />
            <NotAuthorized height={250} open={isNotAuthorized} onClose={() => setIsNotAuthorized(false)} />
        </div>
    )
}

export default page