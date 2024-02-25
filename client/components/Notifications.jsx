import axios from 'axios';
import Link from 'next/link'
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loading from '@/components/General/Loading';
import { Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import NoDataLottie from './General/NoDataLottie';

const Notifications = ({handleCloseNotification}) => {
  const userInfo = useSelector(state => state.user.userInfo)
  const token = JSON.parse(localStorage.getItem("token"))
  const [notificationsData, setNotificationsData] = useState([])
  const [notificationLoading, setNotificationLoading] = useState(false)
  const { enqueueSnackbar } = useSnackbar();
  const { push } = useRouter();

  useEffect(() => {
    if (userInfo) {
      fetchNotifications();
    }
  }, [userInfo])

  const fetchNotifications = () => {
    setNotificationLoading(true)
    axios.get(`${process.env.API_URL}user/notifications/${userInfo?._id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const formattedNotifications = res?.data?.map(notification => {
          const navigationLink = handleGetRedirectLink(notification.notificationType, notification.navigationId);

          return { ...notification, navigationLink: navigationLink }
        })

        setNotificationsData(formattedNotifications)
      })
      .catch(err => {
        enqueueSnackbar("Something went wrong while fetching notifications", { variant: "error" })
      })
      .finally(() => {
        setNotificationLoading(false)
      })
  }

  const handleGetRedirectLink = (type, id) => {
    if (type === "save" || type === "like" || type === "comment" || "University Announcement" || "approve") {
      return `http://localhost:3000/home/post/${id}`
    }

    if (type === "classroom_enrollment" || "classroom_approved" || "Classroom Announcement") {
      return `http://localhost:3000/home/classrooms/${id}`
    }

    if (type === "classroom_removed") {
      return `http://localhost:3000/home/classrooms`
    }

    if (type === "report") {
      return `http://localhost:3000/home/reported-posts`
    }

    if (type === "delete") {
      return `http://localhost:3000/home`
    }

    if (type === "user_registration") {
      return `http://localhost:3000/home/user-management`
    }

    return `http://localhost:3000/home`
  }

  return (
    <>
      {
        notificationLoading ? <Loading height={150} /> :
          <div className='flex flex-col mt-1 h-full overflow-y-auto p-2 w-56'>
            {
              notificationsData && notificationsData.length > 0 ? notificationsData.map(notification => (
                <div
                  onClick={() => {
                    push(notification.navigationLink)
                    handleCloseNotification();
                  }}
                  className='flex items-center py-2 hover:bg-main transition cursor-pointer px-1 md:px-2'
                >
                  <Avatar className="w-8 h-8 mr-2" src={notification.sender.profilePicture} alt={notification.sender.name} />
                  <p className='text-textColor text-xs md:text-sm'>
                    {notification.message}
                  </p>
                </div>
              )) : <NoDataLottie height={100} message={"No notification"} />
            }
          </div>
      }
    </>
  )
}

export default Notifications