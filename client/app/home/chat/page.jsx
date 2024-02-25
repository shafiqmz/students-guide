"use client"

import useGetRole from '@/components/General/CustomHooks/useGetRole';
import NotAuthorized from '@/components/General/NotAuthorized';
import { Avatar, Badge } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BiMessageRoundedEdit } from "@react-icons/all-files/bi/BiMessageRoundedEdit";
import { StartConvoDialog } from './Components/StartConvoDialog';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import PageLoader from '@/components/General/PageLoader';
import NoDataLottie from '@/components/General/NoDataLottie';
import { useRouter } from 'next/navigation';

const page = () => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const { push } = useRouter();
  const role = useGetRole();
  const [isNotAuthorized, setIsNotAuthorized] = useState(false);
  const [openStartConvoDialog, setOpenStartConvoDialog] = useState(false)
  const [conversations, setConversations] = useState([])
  const [conversationLoading, setConversationLoading] = useState(false)
  const token = JSON.parse(localStorage.getItem("token"))
  const { enqueueSnackbar } = useSnackbar();
  
  useEffect(() => {
    if (!userInfo?._id || role === 'Superadmin') {
      setIsNotAuthorized(true);
      return;
    }
    fetchConversations();
  }, []);

  const fetchConversations = () => {
    setConversationLoading(true)
    axios.get(`${process.env.API_URL}chat/conversation/all/${userInfo._id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setConversations(res?.data)
      })
      .catch((err) => {
        enqueueSnackbar("Something went wrong while fetching conversation")
      })
      .finally(() => {
        setConversationLoading(false)
      })
  }

  return (
    <>
      {
        conversationLoading ? <PageLoader /> :
          <div className="flex justify-center pt-4 pb-20 h-screen overflow-y-auto">
            <div className="w-11/12 xs:w-10/12 md:w-3/4 flex flex-col bg-white shadow-lg rounded-lg py-2 md:py-3 mt-3">
              <div className="my-2 flex mx-3 items-center justify-between">
                <h3 className='border-b-2 md:mx-4 lg:mx-6 border-primaryBlue text-primaryBlue font-semibold text-2xl'>
                  Chats
                </h3>
                <button className="cursor-pointer text-white rounded-md py-1 bg-primaryBlue hover:bg-secondaryOrange transition-all duration-100 px-2 flex items-center" onClick={() => setOpenStartConvoDialog(true)}>
                  <BiMessageRoundedEdit className='text-xl text-white mr-1' />
                  <span>Start conversation</span>
                </button>
              </div>
              <div className="flex flex-col mt-1 h-full overflow-y-auto">
                {
                  conversations && conversations.length > 0 ?
                    conversations.map(conversation => (
                      <div onClick={() => push(`/home/chat/${conversation._id}`)} className={`flex items-center py-4 hover:bg-main transition-linear cursor-pointer px-3 md:px-4 lg:px-6 ${!conversation.isRead && "bg-main hover:bg-mainHover"}`}>
                        <div className="relative">
                          <Avatar className="w-8 h-8 md:w-10 md:h-10" src={conversation.participants[0].profilePicture} alt={conversation.participants[0].name} />
                        </div>
                        <div className="flex flex-col ml-3 w-full">
                          <p className="text-textColor text-sm md:text-md font-semibold">{conversation.participants[0].name}</p>
                          <p className="text-xs md:text-sm text-bgContrast overflow-hidden text-ellipsis whitespace-nowrap" style={{ maxWidth: '90%' }}>
                            {conversation.lastMessage.content}
                          </p>
                        </div>
                      </div>
                    ))
                    : <NoDataLottie height={200} message={"No Conversations"} />
                }
              </div>
            </div>
            <NotAuthorized
              height={250}
              open={isNotAuthorized}
              onClose={() => setIsNotAuthorized(false)}
            />
            <StartConvoDialog open={openStartConvoDialog} onClose={() => setOpenStartConvoDialog()} />
          </div>
      }
    </>
  );
};

export default page;
