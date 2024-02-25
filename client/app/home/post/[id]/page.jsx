"use client"
import React, { useEffect, useState } from 'react'
import axios from "axios"
import ErrorDialog from './ErrorDialog';
import PageLoader from '@/components/General/PageLoader';
import PostUi from '@/components/Post/PostUi';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '@/redux/features/Post/postSlice';

const page = ({ params }) => {
  const [postData, setPostData] = useState({});
  const [loading, setLoading] = useState(false);
  const { id } = params
  const token = JSON.parse(localStorage.getItem("token"))
  const [openErrorDialog, setOpenErrorDialog] = useState(false)
  const [errorCode, setErrorCode] = useState(false)
  const dispatch = useDispatch();
  const postsFromRedux = useSelector(state => state.post.posts)

  useEffect(() => {
    setLoading(true)
    axios.get(`${process.env.API_URL}posts/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        dispatch(setPosts([res?.data]))
      })
      .catch(err => {
        setOpenErrorDialog(true)
        setErrorCode(err.response.status)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    setPostData(postsFromRedux)
  }, [postsFromRedux])

  return (
    <>
      <div className="pt-6 pr-2 xs:px-6 md:px-16 pb-20 h-screen overflow-y-auto">
        {loading ? <PageLoader /> : !errorCode && postData && postData.length > 0 && <PostUi post={postData[0]} />}
      </div>
      <ErrorDialog errorCode={errorCode} open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} />
    </>
  )
}

export default page