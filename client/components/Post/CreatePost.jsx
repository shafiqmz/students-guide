import React, { useEffect, useRef, useState } from 'react';
import SentForVerificationLottie from '../General/SentForVerificationLottie';
import ServerErrorLottie from '../General/ServerErrorLottie';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@mui/material';
import { GrFormClose } from '@react-icons/all-files/gr/GrFormClose';
import { ImFileText2 } from '@react-icons/all-files/im/ImFileText2';
import TruncatedTextWithTooltip from '../General/UtilityFunctions/TruncatedText';
import { AttachmentViewer } from '../General/AttachmentViewer';
import { useDispatch, useSelector } from 'react-redux';
import axios from "axios"
import Loading from '../General/Loading';
import { createPost } from '@/redux/features/Post/postActions';
import { useSnackbar } from "notistack";

const CreatePost = ({ open, onClose, type, announcement, assignment, classroom, classroomId }) => {
  const userInfo = useSelector((state) => state.user.userInfo);
  const [dispatchedForm, setDispatchedForm] = useState(false);
  const [dispatchedMessage, setDispatchedMessage] = useState(false);
  const fileInputRef = useRef(null);
  const [dueDate, setDueDate] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState([]);
  const [previewMedia, setPreviewMedia] = useState([]);
  const [showAttachment, setShowAttachment] = useState(false);
  const [loading, setLoading] = useState(false);
  const [clickedIndex, setClickedIndex] = useState(0);
  const universityId = useSelector(state => state.user.userInfo.university)
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  // For post button disabled
  const isPostContentEmpty = postContent.trim() === '';
  const isNoMediaSelected = selectedMedia.length === 0;
  const isDueDateSelected = !assignment || (assignment && dueDate !== "");
  
  const isButtonDisabled = (isPostContentEmpty && isNoMediaSelected) || !isDueDateSelected;  

  const removeMedia = (index) => {
    const updatedImages = [...selectedMedia];
    updatedImages.splice(index, 1);
    setSelectedMedia(updatedImages);
  };

  useEffect(() => {
    if (selectedMedia) {
      const mediaArray = [];
      const imagePreviews = [];

      if (selectedMedia.length === 0) {
        setPreviewMedia([]);
      }

      for (let i = 0; i < selectedMedia.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataURL = e.target.result;

          mediaArray.push(imageDataURL);
          imagePreviews.push(
            <div className='relative'>
              {type?.type === 'image' ? (
                <div
                  className='h-24 w-24 m-2 flex flex-col items-center mt-4 rounded-lg shadow-md cursor-default'
                  onClick={() => {
                    setShowAttachment(true);
                    setClickedIndex(i);
                  }}
                >
                  <img
                    key={i}
                    src={imageDataURL}
                    alt={`Post Image ${i + 1}`}
                    className='w-12 h-12 object-cover m-2 rounded-lg'
                  />
                  <p className='text-xs text-center font-semibold mt-2'>
                    {
                      <TruncatedTextWithTooltip
                        text={selectedMedia[i]?.name}
                        maxLength={10}
                      />
                    }
                  </p>{' '}
                </div>
              ) : (
                <div className='h-24 w-24 m-2 flex flex-col items-center mt-4 rounded-lg shadow-md cursor-default'>
                  <ImFileText2 className='text-6xl text-secondaryOrange' />
                  <p className='text-xs text-center font-semibold mt-2'>
                    {
                      <TruncatedTextWithTooltip
                        text={selectedMedia[i]?.name}
                        maxLength={10}
                      />
                    }
                  </p>{' '}
                </div>
              )}

              <div
                onClick={() => removeMedia(i)}
                className='absolute top-[2px] right-0 text-xl bg-primaryBlue cursor-pointer rounded-full'
              >
                <GrFormClose />
              </div>
            </div>
          );
          if (mediaArray.length === selectedMedia.length) {
            setPreviewMedia(imagePreviews);
          }
        };

        reader.readAsDataURL(selectedMedia[i]);
      }
    }
  }, [selectedMedia]);

  const handleMediaChange = (event) => {
    setSelectedMedia(event.target.files);

    if (selectedMedia && selectedMedia.length > 0) {
      const mediaArray = [];
      const imagePreviews = [];

      for (let i = 0; i < selectedMedia.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataURL = e.target.result;

          mediaArray.push(imageDataURL);
          imagePreviews.push(
            <div className='relative'>
              <img
                key={i}
                src={imageDataURL}
                alt={`University Image ${i + 1}`}
                className='w-24 h-24 object-cover m-2 rounded-lg'
              />
              <div
                onClick={() => removeMedia(i)}
                className='absolute top-[2px] right-0 text-xl bg-primaryBlue cursor-pointer rounded-full'
              >
                <GrFormClose />
              </div>
            </div>
          );
          if (mediaArray.length === selectedMedia.length) {
            setPreviewMedia(imagePreviews);
          }
        };

        reader.readAsDataURL(selectedMedia[i]);
      }
    }
  };

  const openFileInput = (type) => {
    if (type === 'image') {
      fileInputRef.current = document.getElementById('postImages');
    } else {
      fileInputRef.current = document.getElementById('postAttachments');
    }

    if (fileInputRef.current) {
      fileInputRef.current.focus();
      fileInputRef.current.click();
    }
  };

  const inputAccept =
    type?.type === 'image'
      ? 'image/*'
      : '.pdf, .doc, .docx, .txt, .csv, application/msword, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.wordprocessingml.document, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';

  return (
    <Dialog
      open={open}
      onClose={() => {
        setPreviewMedia([]);
        setSelectedMedia([]);
        setDispatchedForm(false);
        setDispatchedMessage("")
        onClose();
      }}
      classes={{ paper: 'custom-dialog' }}
    >
      <DialogTitle className='text-textColor'>
        {announcement
          ? 'Create Announcement'
          : assignment
            ? 'Create Assignment'
            : 'Create Post'}
      </DialogTitle>
      <DialogContent className='pb-0'>
        {loading ? <Loading height={200} /> : dispatchedForm && dispatchedMessage === "Sent for approval" ? (
          <div className='flex flex-col justify-center'>
            <SentForVerificationLottie height={200} />
            <h4 className='mt-2 font-semibold'>
              Your post sent for approval and will be visible after approval.
            </h4>
          </div>
        ) : dispatchedMessage === "Internal Server Error" ? (
          <div className='flex flex-col justify-center'>
            <ServerErrorLottie height={200} />
            <h4 className='mt-2 font-semibold'>
              Something went wrong.
            </h4>
          </div>
        ) : (
          <div>
            <textarea
              name='content'
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              id='content'
              autoFocus={fileInputRef}
              rows='4'
              className='resize-none bg-gray-100 rounded-lg p-3 outline-none w-full placeholder:text-bgContrast'
              placeholder={announcement ? "Write a announcement" : assignment ? "Write Instructions for the assignment" : "Write a post"}
            />
            {assignment && 
            <>
            <label htmlFor="dueData">Due Date</label>
            <input
              name="dueDate"
              id="dueDate"
              type="date"
              className="bg-gray-100 cursor-pointer rounded-lg p-3 outline-none w-full placeholder:text-bgContrast mt-2"
              placeholder="Due Date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
            </>}
            {type && (
              <>
                <input
                  type='file'
                  name='postInput'
                  id={type?.type === 'image' ? 'postImages' : 'postAttachments'}
                  accept={inputAccept}
                  ref={fileInputRef}
                  multiple
                  onChange={handleMediaChange}
                  style={{ display: 'none' }}
                />
                <label htmlFor='postInput'>
                  <button
                    onClick={() => openFileInput(type?.type)}
                    className='px-6 mx-auto bg-primaryBlue transition-all hover:bg-secondaryOrange  text-white rounded-md h-12 text-lg mt-3 w-full'
                  >
                    Upload {type?.type === 'image' ? 'Images' : 'Attachments'}
                  </button>
                </label>
              </>
            )}
            <div className='flex flex-wrap mt-3'>{previewMedia}</div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            setPreviewMedia([]);
            setSelectedMedia([]);
            onClose();
          }}
        >
          Close
        </Button>
        {!dispatchedForm && (
          <Button
            variant='contained'
            className='bg-primaryBlue disabled:bg-lightBlue'
            onClick={() => {
              const postData = new FormData();
              if (assignment) {
                postData.append('author', userInfo?._id);
                postData.append('content', postContent.trim());
                postData.append('mediaType', type?.type);
                postData.append('university', universityId);
                postData.append('classroomId', classroomId);
                postData.append('isAssignment', assignment);
                postData.append('assignmentDueDate', dueDate);

                // Add classroom
                if (selectedMedia && selectedMedia.length > 0) {
                  for (let i = 0; i < selectedMedia.length; i++) {
                    postData.append('media', selectedMedia[i]);
                  }
                }
              } else if (classroom && announcement) {
                postData.append('content', postContent.trim());
                postData.append('mediaType', selectedMedia?.length > 0 ? type?.type : null);
                postData.append('university', universityId);
                postData.append('classroomId', classroomId);
                postData.append('isAnnouncement', announcement);
                if (selectedMedia && selectedMedia.length > 0) {
                  for (let i = 0; i < selectedMedia.length; i++) {
                    postData.append('media', selectedMedia[i]);
                  }
                }
              } else if (announcement) {
                postData.append('content', postContent.trim());
                postData.append('mediaType', selectedMedia?.length > 0 ? type?.type : null);
                postData.append('university', universityId);
                postData.append('isAnnouncement', announcement);
                if (selectedMedia && selectedMedia.length > 0) {
                  for (let i = 0; i < selectedMedia.length; i++) {
                    postData.append('media', selectedMedia[i]);
                  }
                }
              }
               else {
                postData.append('content', postContent.trim());
                postData.append('mediaType', selectedMedia?.length > 0 ? type?.type : null);
                postData.append('university', universityId);
                if (selectedMedia && selectedMedia.length > 0) {
                  for (let i = 0; i < selectedMedia.length; i++) {
                    postData.append('media', selectedMedia[i]);
                  }
                }
              }


              const token = JSON.parse(localStorage.getItem("token"));
              setLoading(true)
              // axios.post(`${process.env.API_URL}posts/create-post`, postData, {
              //   headers: {
              //     Authorization: `Bearer ${token}`,
              //   },
              // }).then(response => {
              //   setDispatchedForm(true);
              //   setLoading(false)
              //   if (response.status === 201) {
              //     setDispatchedForm(false)
              //     onClose();
              //   } else if (response.status === 203) {
              //     setDispatchedMessage("Sent for approval")
              //   } else {
              //     setDispatchedMessage("Internal Server Error")
              //   }
              //   setPostContent('');
              //   setSelectedMedia([]);
              // }).catch(error => {
              //   setLoading(false)
              //   setDispatchedMessage("Internal Server Error")
              // })
              dispatch(createPost(token, postData, userInfo))
                .then(response => {
                  setLoading(false);
                  if (response.status === 201) {
                    onClose();
                    setPostContent('');
                    setDueDate('');
                    setSelectedMedia([]);
                  } else if (response.status === 203) {
                    setDispatchedMessage("Sent for approval");
                    enqueueSnackbar("Post send for approval", {variant: "success"})
                    onClose()
                    setPostContent('');
                    setDueDate('');
                    setSelectedMedia([]);
                  } else {
                    setDispatchedMessage("Internal Server Error");
                    enqueueSnackbar("Something went wrong while creating post.", {variant: "error"})
                  }
                })
                .catch(error => {
                  setLoading(false);
                  setDispatchedMessage("Internal Server Error");
                });

            }}
            disabled={isButtonDisabled}
          >
            Post
          </Button>
        )}
      </DialogActions>
      {showAttachment && (
        <AttachmentViewer
          onClose={() => setShowAttachment(false)}
          attachmentObject={selectedMedia}
          index={clickedIndex}
        />
      )}
    </Dialog>
  );
};

export default CreatePost;
