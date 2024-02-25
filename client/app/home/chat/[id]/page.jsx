"use client"
import { Avatar } from '@mui/material'
import React, { useEffect, useRef, useState } from 'react'
import Message from '../Components/Message'
import { useSelector } from 'react-redux'
import { IoIosArrowBack } from '@react-icons/all-files/io/IoIosArrowBack'
import { useRouter } from "next/navigation"
import axios from 'axios'
import { useSnackbar } from 'notistack'
import PageLoader from '@/components/General/PageLoader'
import NoDataLottie from '@/components/General/NoDataLottie'
import { formatDistanceToNow } from 'date-fns'
import { io } from 'socket.io-client'

const page = ({ params }) => {
  const { id } = params
  const userInfo = useSelector((state) => state.user.userInfo);
  const { push } = useRouter();
  const [messageText, setMessageText] = useState("");
  const [conversationLoading, setConversationLoading] = useState(false);
  const [conversationInfo, setConversationInfo] = useState({});
  const [messages, setMessages] = useState([]);
  const { enqueueSnackbar } = useSnackbar();
  const token = JSON.parse(localStorage.getItem("token"))
  const messagesContainerRef = useRef(null);
  const socket = useRef()

  useEffect(() => {
    socket.current = io("ws://localhost:8900")

    socket.current.on("getMessage", data => {
      setMessages(prevMessages => [...prevMessages, data])
    })

  }, [])

  useEffect(() => {

    socket.current.emit("addUser", userInfo._id)

    socket.current.on("getUsers", (users) => {
      console.log(users)
    })

  }, [])

  useEffect(() => {
    fetchConversation();
  }, [])

  useEffect(() => {
    if (messagesContainerRef.current) {
      if (messagesContainerRef.current) {
        const messagesContainer = messagesContainerRef.current;
        const lastMessage = messagesContainer.lastChild;
        
        if (lastMessage) {
          lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
        }
      } 
    }
  }, [messages]);

  const fetchConversation = () => {
    setConversationLoading(true)
    axios.get(`${process.env.API_URL}chat/conversation/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((res) => {
        setConversationInfo(res?.data?.participants[0])
        setMessages(res?.data?.messages)
      })
      .catch((err) => {
        if (err.response.status === 404) {
          enqueueSnackbar("Conversation not found")
          return push('/home/chats')
        } else {
          enqueueSnackbar("Something went wrong while ")
          return push('/home/chat')
        }
      })
      .finally(() => {
        setConversationLoading(false)
      })
  }

  const handleMessageSubmit = () => {
    if (messageText.trim()) {
      const payload = {
        sender: userInfo?._id,
        conversationId: id,
        content: messageText
      }
      axios.post(`${process.env.API_URL}chat/send/message`, payload, { headers: { Authorization: `Bearer ${token}` } })
        .then(() => {

          socket.current.emit("sendMessage", {
            userId: userInfo._id,
            receiverId: conversationInfo?._id,
            content: messageText,
            userName: userInfo.name,
          })
          setMessageText('');
          const newMessage = {
            sender: {
              _id: userInfo?._id,
              name: userInfo?.name,
              profilePicture: userInfo?.profilePicture
            },
            content: messageText,
            timestamp: Date.now(),
          }
          setMessages(prevMessage => [...prevMessage, newMessage])
        })
        .catch(() => {
          enqueueSnackbar("Failed to send the message", "error");
        })
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleMessageSubmit();
    }
  };

  return (
    <>
      {
        conversationLoading ? <PageLoader /> :
          conversationInfo &&
          <div className="flex justify-center pt-4 pb-20 h-screen overflow-y-auto">
            <div className="w-11/12 xs:w-10/12 md:w-3/4 flex flex-col bg-white shadow-lg rounded-lg py-2 md:py-3">
              <div className='my-2 border-b-2 mx-3 md:mx-4 lg:mx-6 border-primaryBlue text-primaryBlue font-semibold text-xl flex items-center py-4'>
                <div className="p-2 bg-main rounded-full mr-2 cursor-pointer" onClick={() => push("/home/chat")}><IoIosArrowBack className="text-xl" /></div>
                <Avatar className="w-8 h-8 md:w-10 md:h-10" src={conversationInfo?.profilePicture} alt={conversationInfo?.name} />
                <p className='font-semibold text-sm sm:text-md md:text-lg ml-2 text-textColor'>{conversationInfo?.name}</p>
              </div>
              <div className="flex flex-col h-5/6 bg-main overflow-y-auto mx-3 md:mx-4 lg:mx-6 rounded-lg py-2 px-3" ref={messagesContainerRef}>
                {messages &&
                  messages?.length > 0 ?
                  messages.map((message) =>
                    <Message
                      message={message.content}
                      own={message.sender._id === userInfo._id}
                    />) :
                  <NoDataLottie height={200} message="No messages as of yet" />
                }
              </div>
              <div className="flex flex-col h-1/6 mt-3 bg-main overflow-y-auto mx-3 md:mx-4 lg:mx-6 rounded-lg py-2 px-3">
                <div className="w-full flex items-center">
                  <Avatar src={userInfo?.name} alt={userInfo?.name} className="w-8 h-8" />
                  <textarea onKeyDown={handleKeyDown} type="text" autoFocus="true" value={messageText} onChange={(e) => setMessageText(e.target.value)} className='w-full bg-main outline-none p-2 ml-1 rounded-2xl text-sm h-full resize-none' placeholder="Write a message..." />
                </div>
              </div>
            </div>
          </div>
      }
    </>
  )
}

export default page