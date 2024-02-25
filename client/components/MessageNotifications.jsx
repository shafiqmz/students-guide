import axios from 'axios';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import Loading from '@/components/General/Loading';
import { Avatar } from '@mui/material';
import { useRouter } from 'next/navigation';
import NoDataLottie from './General/NoDataLottie';

const MessageNotification = ({ handleCloseMessageNotification }) => {
    const userInfo = useSelector(state => state.user.userInfo)
    const token = JSON.parse(localStorage.getItem("token"))
    const [conversationData, setConversationData] = useState([])
    const [conversationDataLoading, setConversationDataLoading] = useState(false)
    const { enqueueSnackbar } = useSnackbar();
    const { push } = useRouter();

    useEffect(() => {
        if (userInfo) {
            fetchNotifications();
        }
    }, [userInfo])

    const fetchNotifications = () => {
        setConversationDataLoading(true)
        axios.get(`${process.env.API_URL}chat/conversation/all/${userInfo?._id}`, { headers: { Authorization: `Bearer ${token}` } })
            .then(res => {
                setConversationData(res?.data)
            })
            .catch(err => {
                enqueueSnackbar("Something went wrong while fetching conversation", { variant: "error" })
            })
            .finally(() => {
                setConversationDataLoading(false)
            })
    }

    return (
        <>
            {
                conversationDataLoading ? <Loading height={150} /> :
                    <div className='flex flex-col mt-1 h-full overflow-y-auto p-2 w-56'>
                        {
                            conversationData && conversationData.length > 0 ? conversationData.map(conversation => (
                                <div
                                    onClick={() => {
                                        push(`/home/chat/${conversation._id}`)
                                        handleCloseMessageNotification();
                                    }}
                                    className={` rounded-md flex items-center py-2 hover:bg-main transition-linear cursor-pointer px-2 ${!conversation.isRead && "bg-main hover:bg-mainHover"}`}
                                >
                                    <div className='relative'>
                                        {/* <div className='w-2 h-2 bg-primaryBlue z-50 absolute rounded-full right-0'></div> */}
                                        <Avatar
                                            className='w-8 h-8'
                                            src={conversation.participants[0]?.profilePicture}
                                            alt={conversation.participants[0]?.name}
                                        />
                                    </div>
                                    <div className='flex flex-col ml-2 w-full'>
                                        <p className='text-textColor text-xs md:text-sm font-semibold'>
                                        {conversation.participants[0]?.name}
                                        </p>
                                        <p
                                            className='text-[10px] md:text-xs text-bgContrast overflow-hidden text-ellipsis whitespace-nowrap'
                                            style={{ maxWidth: '90%' }}
                                        >
                                            {conversation.lastMessage?.content}
                                        </p>
                                    </div>
                                </div>
                            )) : <NoDataLottie height={100} message={"No notification"} />
                        }
                    </div>
            }
        </>
    )
}

export default MessageNotification