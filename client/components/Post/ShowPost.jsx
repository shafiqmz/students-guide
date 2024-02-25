"use client"
import React, { useEffect, useState } from 'react';
import PostUi from './PostUi';
import { useDispatch, useSelector } from 'react-redux';
import { getUserPosts, getUserPostsById, getClassroomPosts, getUserSavedPost } from '@/redux/features/Post/postActions';
import PageLoader from '../General/PageLoader';
import { useSnackbar } from 'notistack';
import { setMorePosts } from '@/redux/features/Post/postSlice';
import SmallSpinnerLoader from '../General/SmallSpinnerLoader';

const ShowPost = ({ assignment, postApproval, announcement, postReport, userId, profile, classroom, classroomId, saved }) => {
  const dispatch = useDispatch();
  const token = JSON.parse(localStorage.getItem("token"));
  const postsFromRedux = useSelector(state => state.post.posts)
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(0)
  const [hasMore, setHasMore] = useState(false);
  const {enqueueSnackbar} = useSnackbar();
  const [renderedOnce, setRenderedOnce] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!renderedOnce) {
      if (classroom) {
        if (classroomId) {
          setLoading(true)
          dispatch(getClassroomPosts(token, page, 10, classroomId, postApproval, announcement, postReport, assignment)).then(res => {
            dispatch(setMorePosts(res?.data));
            setHasMore(res?.data?.length < 9 ? false : true)
            setPage(prevPage => prevPage + 1)
            setLoading(false)
          })
            .catch((err) => {
              setLoading(false)
              enqueueSnackbar("Something went wrong while fetching posts.", { variant: "error" })
            });
          setRenderedOnce(true)
        }
      } else if (profile) {
        if (userId) {
          setLoading(true)
          dispatch(getUserPostsById(token, userId)).then(res => {
            setHasMore(false);
            setLoading(false)
          })
            .catch((err) => {
              setLoading(false)
              enqueueSnackbar("Something went wrong while fetching posts.", { variant: "error" })
            });
          setRenderedOnce(true)
        }
      } else if (saved) {
        setLoading(true)
          dispatch(getUserSavedPost(token)).then(res => {
            setHasMore(false);
            setLoading(false)
          })
            .catch((err) => {
              setLoading(false)
              enqueueSnackbar("Something went wrong while fetching posts.", { variant: "error" })
            });
          setRenderedOnce(true)
      } else {
        setLoading(true)
        dispatch(getUserPosts(token, page, 10, postApproval, announcement, postReport)).then(res => {
          dispatch(setMorePosts(res?.data));
          setHasMore(res?.data?.length < 9 ? false : true)
          setPage(prevPage => prevPage + 1)
          setLoading(false)
        })
          .catch((err) => {
            setLoading(false)
            enqueueSnackbar("Something went wrong while fetching posts.", { variant: "error" })
          });
        setRenderedOnce(true)
      }
    }
  }, [userId])

  useEffect(() => {
    setPosts(postsFromRedux)
  }, [postsFromRedux])

  const loadMore = () => {
    setMoreLoading(true);
    if (classroom) {
      if (classroomId) {
        dispatch(getClassroomPosts(token, page, 10, classroomId, postApproval, announcement, postReport, assignment)).then(res => {
          dispatch(setMorePosts([...posts, ...res?.data]));
          setHasMore(res?.data?.length < 9 ? false : true)
          setPage(prevPage => prevPage + 1)
          setMoreLoading(false);
        })
          .catch((err) => {
            setMoreLoading(false);
            enqueueSnackbar("Something went wrong while fetching posts.", { variant: "error" })
          });
        setRenderedOnce(true)
      }
    } else {
      dispatch(getUserPosts(token, page, 10, postApproval, announcement, postReport)).then(res => {
        dispatch(setMorePosts([...posts, ...res?.data]));
        setHasMore(res?.data?.length < 9 ? false : true)
        setPage(prevPage => prevPage + 1)
        setMoreLoading(false);
      }).catch((err) => {
        setMoreLoading(false);
        enqueueSnackbar("Something went wrong while fetching posts.", { variant: "error" })
      });
    }
  }

  return (
    <>
      {!loading ? (posts?.length > 0 && posts?.map((post, index) => (
        <PostUi key={index} post={post} assignment={assignment} announcement={announcement} postApproval={postApproval} postReport={postReport} classroom={classroom} />)
      )) : <PageLoader />}
      {
        renderedOnce && (
          hasMore ?
            <button onClick={loadMore} className='mt-4 mx-auto py-2 px-4 bg-primaryBlue hover:bg-lightBlue hover:text-textColor text-white rounded-md flex items-center'>
              {moreLoading && <SmallSpinnerLoader />} <p className='ml-2'>Load More</p>
            </button> : <p className='mt-4 flex justify-center'>🙌 You're all caught up.</p>
        )
      }
    </>
  );
};

export default ShowPost;

