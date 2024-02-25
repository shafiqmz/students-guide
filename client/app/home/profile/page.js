"use client"

import NotAuthorized from '@/components/General/NotAuthorized';
import React, { useState, useEffect } from 'react'
import Profile from './Components/Profile';
import { useSelector } from 'react-redux';
import {usePathname, useRouter} from "next/navigation"
import useGetRole from '@/components/General/CustomHooks/useGetRole';

const page = () => {
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);
  const userInfo = useSelector(state => state.user.userInfo);
  const role = useGetRole();

  useEffect(() => {
    if (!userInfo?._id) {
      setIsNotAuthorized(true);
      return;
    }
  }, []);

  return (
    <>
      <Profile mine={true} user={userInfo} />
      <NotAuthorized
        height={250}
        open={isNotAuthorized}
        onClose={() => setIsNotAuthorized(false)}
      />
    </>
  )
}

export default page