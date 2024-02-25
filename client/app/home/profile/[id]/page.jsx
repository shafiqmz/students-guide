"use client"

import React, { useEffect, useState } from 'react'
import Profile from '../Components/Profile'
import { useSelector } from 'react-redux';
import PageLoader from '@/components/General/PageLoader';
import axios from 'axios';

const page = ({ params }) => {
  const { id } = params;
  const userId = useSelector(state => state.user.userInfo._id)
  const mine = userId === id;
  const token = JSON.parse(localStorage.getItem("token"))
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const apiUrl = `${process.env.API_URL}user/${mine ? userId : id}`;
    axios.get(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        setUser(res?.data)
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  }, [])

  return (
    <>
      {
        loading ? user && <PageLoader page={true} /> : <Profile mine={mine} user={user} />
      }
    </>
  )
}

export default page