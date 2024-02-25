import { Avatar, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import React, { useCallback, useEffect, useState } from 'react'
import Comment from './Comment'
import { useDispatch, useSelector } from 'react-redux';
import { ImAttachment } from '@react-icons/all-files/im/ImAttachment';
import { ImFileText2 } from '@react-icons/all-files/im/ImFileText2';
import TruncatedTextWithTooltip from '../General/UtilityFunctions/TruncatedText';
import { AttachmentViewer } from '../General/AttachmentViewer';
import { addComment } from '@/redux/features/Post/postActions';
import { RiSendPlane2Line } from "@react-icons/all-files/ri/RiSendPlane2Line";
import SmallSpinnerLoader from '../General/SmallSpinnerLoader';

const CommentDialog = ({ showCommentDialog, setShowCommentDialog, comments, postId }) => {
    const userInfo = useSelector((state) => state.user.userInfo);
    const token = JSON.parse(localStorage.getItem("token"));
    const autoFocusFn = useCallback(element => (element ? element.focus() : null), []);
    const [mediaType, setMediaType] = useState("")
    const [attachment, setAttachment] = useState(null);
    const [previewMedia, setPreviewMedia] = useState()
    const [showAttachment, setShowAttachment] = useState(false);
    const [commentText, setCommentText] = useState("");
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        handleAttachmentChange(attachment)
    }, [attachment])

    const handleAttachmentChange = (file) => {
        if (file === null) {
            setPreviewMedia(null)
            return
        }
        if (file.type.startsWith('image/')) {
            setMediaType("image")
            setPreviewMedia(<div
                className='h-24 w-24 m-2 flex flex-col items-center mt-4 rounded-lg shadow-md cursor-default'
                onClick={() => {
                    setShowAttachment(true);
                }}
            >
                <img
                    src={URL.createObjectURL(file)}
                    alt={`Comment Image`}
                    className='w-12 h-12 object-cover m-2 rounded-lg'
                />
                <p className='text-xs text-center font-semibold mt-2'>
                    {
                        <TruncatedTextWithTooltip
                            text={file?.name}
                            maxLength={10}
                        />
                    }
                </p>{' '}
            </div>)
        } else {
            setMediaType("file")
            setPreviewMedia(<div className='h-24 w-24 m-2 flex flex-col items-center mt-4 rounded-lg shadow-md cursor-default'>
                <ImFileText2 className='text-6xl text-secondaryOrange' />
                <p className='text-xs text-center font-semibold mt-2'>
                    {
                        <TruncatedTextWithTooltip
                            text={file?.name}
                            maxLength={10}
                        />
                    }
                </p>{' '}
            </div>)
        }

    }

    const handleInputChange = (event) => {
        const file = event.target.files[0];
        setAttachment(file)
    };

    const handleCommentSubmit = () => {
        if (commentText || attachment) {
            const formData = new FormData();
            if (commentText) {
                formData.append('text', commentText);
            }
            if (attachment) {
                formData.append('attachment', attachment);
            }

            formData.append('mediaType', mediaType)

            setLoading(true);

            dispatch(addComment(token, postId, formData, userInfo)).then(res => {
                setCommentText('');
                setMediaType("")
                setAttachment(null);
                setLoading(false);
            })
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleCommentSubmit();
        }
    };


    return (
        <Dialog open={showCommentDialog} onClose={() => setShowCommentDialog(false)} classes={{ paper: 'custom-dialog' }}>
            <DialogTitle className='text-textColor'>Comments</DialogTitle>
            <DialogContent className='p-2 xs:p-3 sm:p-4 md:p-6'>
                {comments?.map(comment => (
                    <Comment comment={comment} />
                ))
                }
            </DialogContent>
            <DialogActions className='p-2 xs:p-3 sm:p-4 md:p-6 flex flex-col' sx={{ position: "relative" }}>
                <div className="w-full flex items-center">
                    <Avatar src={userInfo?.profilePicture} alt={userInfo?.name} className="w-8 h-8" />
                    <input onKeyDown={handleKeyDown} ref={autoFocusFn} type="text" autoFocus="true" value={commentText} onChange={(e) => setCommentText(e.target.value)} className='w-full bg-main outline-none p-2 ml-1 rounded-2xl text-sm' placeholder="Write a comment..." />
                    <label htmlFor="attachmentInput" className="cursor-pointer mx-2 bg-primaryBlue p-2 rounded-full">
                        <ImAttachment className='text-white' />
                    </label>
                    <button onClick={handleCommentSubmit} className="cursor-pointer bg-primaryBlue p-2 rounded-full">
                        {
                            loading ? <SmallSpinnerLoader /> : <RiSendPlane2Line className='text-white' />
                        }
                    </button>
                    <input
                        type="file"
                        id="attachmentInput"
                        accept=".jpg, .jpeg, .png, .gif, .pdf, .doc, .docx"
                        style={{ display: 'none' }}
                        onChange={handleInputChange}
                    />
                </div>
                {previewMedia}
            </DialogActions>
            {showAttachment && (
                <AttachmentViewer
                    onClose={() => setShowAttachment(false)}
                    attachmentObject={attachment}
                />
            )}
        </Dialog>
    )
}

export default CommentDialog