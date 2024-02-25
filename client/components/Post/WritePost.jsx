import React, { useState } from 'react';
import { Avatar, Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { HiOutlinePhotograph } from '@react-icons/all-files/hi/HiOutlinePhotograph';
import { ImAttachment } from '@react-icons/all-files/im/ImAttachment';
import useWindowDimensions from '../General/CustomHooks/useWindowDimension';
import CreatePost from './CreatePost';

const WritePost = ({ announcement, assignment, classroom, classroomId }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [attachmentClicked, setAttachmentClicked] = useState(null);
  const dimensions = useWindowDimensions();
  const [show, setShow] = useState(false);

  return (
    <div className='flex flex-col bg-white w-full rounded-lg shadow-md px-4 pt-6 py-2'>
      <div className='flex items-center'>
        {dimensions.width > 400 && (
          <Avatar
            src={userInfo?.profilePicture}
            alt={userInfo?.name}
            className='hover:opacity-50 h-10 sm:h-12 w-10 sm:w-12 mr-3'
          />
        )}
        {userInfo?.role === 'Teacher' && assignment ? (
          <button
            onClick={() => setShow(true)}
            className='bg-main w-full outline-none  h-10 sm:h-12 rounded-3xl text-left pl-4 text-xs md:text-md font-light text-bgContrast hover:bg-mainHover transition-colors'
          >
            Create Assignment
          </button>
        ) : (
          <button
            onClick={() => setShow(true)}
            className='bg-main w-full outline-none  h-10 sm:h-12 rounded-3xl text-left pl-4 text-xs md:text-md font-light text-bgContrast hover:bg-mainHover transition-colors'
          >
            {announcement
              ? "Create an Announcemnt"
              : 'Write a post'
            }
          </button>
        )}
      </div>
      <Divider className='pt-3 md:pt-4 lg:pt-5' />
      <div className='flex justify-between items-center mt-3'>
        <button
          onClick={() => {
            setShow(true);
            setAttachmentClicked({ type: 'image' });
          }}
          className='w-1/2 outline-none flex items-center h-10 justify-center hover:bg-[#F2F2F2] rounded-lg'
        >
          <HiOutlinePhotograph className='text-2xl text-primaryBlue' />
          {dimensions.width > 400 && (
            <span className='pl-[2px] xs:pl-2 text-xs font-semibold text-bgContrast'>
              Upload Images
            </span>
          )}
        </button>
        <button
          onClick={() => {
            setShow(true);
            setAttachmentClicked({ type: 'file' });
          }}
          className='w-1/2 outline-none flex items-center h-10 justify-center hover:bg-[#F2F2F2] rounded-lg'
        >
          <ImAttachment className='text-2xl text-primaryBlue' />
          {dimensions.width > 400 && (
            <span className='pl-[2px] xs:pl-2 text-xs font-semibold text-bgContrast'>
              Upload Attachments
            </span>
          )}
        </button>
      </div>
      <CreatePost
        announcement={announcement}
        assignment={assignment}
        classroom={classroom}
        classroomId={classroomId}
        open={show}
        onClose={() => {
          setShow(false);
          setAttachmentClicked(null);
        }}
        type={attachmentClicked}
      />
    </div>
  );
};

export default WritePost;
