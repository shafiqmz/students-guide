import React, { useState, useMemo } from 'react';
import { Avatar } from '@mui/material';
import TruncatedTextWithTooltip from '../General/UtilityFunctions/TruncatedText';
import { ImFileText2 } from '@react-icons/all-files/im/ImFileText2';
import { AttachmentViewer } from '../General/AttachmentViewer';

const Comment = ({ comment }) => {
  const [showAttachment, setShowAttachment] = useState(false)
  const avatarColors = [
    '#FF5733',
    '#00F573',
    '#4286f4',
    '#f441c9',
    '#ffde33',
    '#ff8533',
    '#9433ff',
    '#33ffeb',
  ];

  const commentColor = useMemo(() => {
    return Math.floor(Math.random() * avatarColors.length);
  }, []);

  return (
    <div className='flex mt-2'>
      <Avatar
        alt={comment.author}
        className='w-6 h-6 sm:w-8 sm:h-8'
        style={{
          backgroundColor:
            avatarColors[commentColor],
        }}
        src={comment.authorImage}
      />
      <div className="flex flex-col bg-main p-2 md:p-3 ml-1 rounded-2xl max-w-[70%] break-words">
        <p className="text-xs font-semibold">{comment.author}</p>
        <p className="text-xs mt-1 ">{comment.text}</p>
        {
          comment.mediaType && (
            comment.mediaType === "image" ? <div
              className='h-28 w-24 m-2 flex flex-col items-center bg-white pt-2 mt-4 rounded-lg shadow-md cursor-pointer'
              onClick={() => {
                setShowAttachment(true);
              }}
            >
              <img
                src={comment.media}
                alt={`Comment Image`}
                className='w-20 h-16 object-cover m-2 rounded-lg'
              />
              <p className='text-xs text-center font-semibold mt-1'>
                {
                  <TruncatedTextWithTooltip
                    text={comment.media.split('/').pop()}
                    maxLength={10}
                  />
                }
              </p>{' '}
            </div> : <div className='h-28 w-24 m-2 flex flex-col items-center  bg-white pt-4 mt-4 rounded-lg shadow-md cursor-pointer'>
              <a href={comment?.media} target="_blank" download rel="noopener noreferrer">

                <ImFileText2 className='text-6xl text-secondaryOrange' />
                <p className='text-xs text-center font-semibold mt-2'>
                  {
                    <TruncatedTextWithTooltip
                      text={comment.media.split('/').pop()}
                      maxLength={10}
                    />
                  }
                </p>{' '}
              </a>
            </div>
          )
        }
      </div>
      {showAttachment && (
        <AttachmentViewer
          onClose={() => setShowAttachment(false)}
          attachmentObject={{ url: comment.media, name: comment.media.split('/').pop() }}
        />
      )}
    </div>
  );
};

export default Comment;
