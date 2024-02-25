"use client"
import React, { useEffect, useState } from 'react'
import axios from "axios"
import ErrorDialog from './ErrorDialog';
import PageLoader from '@/components/General/PageLoader';
import PostUi from '@/components/Post/PostUi';

const page = ({ params }) => {
  const [postData, setPostData] = useState({});
  const [loading, setLoading] = useState(false);
  const { id, postId } = params
  const token = JSON.parse(localStorage.getItem("token"))
  const [openErrorDialog, setOpenErrorDialog] = useState(false)
  const [errorCode, setErrorCode] = useState(false)

  useEffect(() => {
    setLoading(true)
    axios.get(`${process.env.API_URL}posts/classroom/${id}/${postId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setPostData(res?.data)
      })
      .catch(err => {
        setOpenErrorDialog(true)
        setErrorCode(err.response.status)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  return (
    <>
      <div className="pt-6 pr-2 xs:px-6 md:px-16 pb-20 h-screen overflow-y-auto">
        {loading ? <PageLoader /> : !errorCode && <PostUi post={postData} />}
      </div>
      <ErrorDialog errorCode={errorCode} open={openErrorDialog} onClose={() => setOpenErrorDialog(false)} />
    </>
  )
}

export default page