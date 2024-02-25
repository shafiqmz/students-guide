import React, { useEffect, useState } from 'react';
import { Avatar, MenuItem, Tooltip, IconButton, Dialog, DialogContent, DialogTitle, Divider } from '@mui/material';
import { formatDistanceToNow } from 'date-fns';
import StyledMenu from '../General/MuiCustom/StyledMenu';
import { HiDotsHorizontal } from '@react-icons/all-files/hi/HiDotsHorizontal';
import { AttachmentViewer } from '../General/AttachmentViewer';
import { ImFileText2 } from '@react-icons/all-files/im/ImFileText2';
import { HiOutlineDownload } from '@react-icons/all-files/hi/HiOutlineDownload';
import { AiTwotoneLike } from '@react-icons/all-files/ai/AiTwotoneLike';
import { AiOutlineLike } from '@react-icons/all-files/ai/AiOutlineLike';
import { FaRegComment } from '@react-icons/all-files/fa/FaRegComment';
import { FiBook } from '@react-icons/all-files/fi/FiBook';
import { GrAnnounce } from '@react-icons/all-files/gr/GrAnnounce';
import { BiSave } from '@react-icons/all-files/bi/BiSave';
import TruncatedTextWithTooltip from '../General/UtilityFunctions/TruncatedText';
import LikeDialog from './LikeDialog';
import CommentDialog from './CommentDialog';
import ReportDialog from './ReportDialog';
import useWindowDimensions from '../General/CustomHooks/useWindowDimension';
import { useDispatch, useSelector } from 'react-redux';
import { approvePost, deletePost, toggleLikePost, toggleSavePost, ignoreReports } from '@/redux/features/Post/postActions';
import { useRouter } from 'next/navigation'
import useGetRole from '../General/CustomHooks/useGetRole';
import { useSnackbar } from 'notistack';
import SmallSpinnerLoader from './../General/SmallSpinnerLoader';
import { SendReportDialog } from './SendReportDialog';
import { convertToDueByFormat } from '../General/UtilityFunctions/timeFunctions';

const PostUi = ({ post, key, postApproval, postReport, classroom }) => {
    const role = useGetRole();
    const user = useSelector(state => state.user.userInfo);
    const userId = user?._id;
    const parsedDate = new Date(post.createdAt || Date.now());
    const timeAgo = formatDistanceToNow(parsedDate, { addSuffix: true });
    const dimensions = useWindowDimensions();
    const [showLikeDialog, setShowLikeDialog] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const { push } = useRouter();
    const open = Boolean(anchorEl);
    const toggleHandleClick = (event) => {
        setAnchorEl((prevAnchorEl) => (prevAnchorEl ? null : event.currentTarget));
    };
    const [showAttachmentViewer, setShowAttachmentViewer] = useState(false);
    const handleClose = () => {
        setAnchorEl(null);
    };
    const [showCommentDialog, setShowCommentDialog] = useState(false)
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false)
    const token = JSON.parse(localStorage.getItem("token"));
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();
    const [approveOrDeleteLoading, setApproveOrDeleteLoading] = useState(false)
    const [declineOrIgnoreLoading, setDeclineOrIgnoreLoading] = useState(false)
    const [showReportDialog, setShowReportDialog] = useState(false);
    const [openReportDialog, setOpenReportDialog] = useState(false)
    
    const handleCopyPostLink = async (event) => {
        event.preventDefault();
    
        const postLink = classroom ? `http://localhost:3000/home/classrooms/${post.classroom}/${post.id}` : `http://localhost:3000/home/post/${post.id}`;
    
        try {
            await navigator.clipboard.writeText(postLink);
            enqueueSnackbar("Copied post link to clipboard.", { variant: "success" });
        } catch (error) {
            console.error('Unable to copy to clipboard', error);
            enqueueSnackbar("Failed to copy post link to clipboard.", { variant: "error" });
        }
    };
    

    useEffect(() => {
        if (post) {
            setLiked(post.likes?.some(like => like.id === userId))
            setSaved(post.saves?.includes(userId))
        }
    }, [post])

    const handleApproveOrDeletePost = () => {
        setApproveOrDeleteLoading(true)
        if (postApproval) {
            dispatch(approvePost(token, post.id)).then(res => {
                setApproveOrDeleteLoading(false)
                if (res.status === 400) {
                    enqueueSnackbar("Post is deleted and can not be approved", {
                        variant: "error"
                    })
                } else if (res.status === 401) {
                    enqueueSnackbar("Post is already approved", {
                        variant: "error"
                    })
                } else if (res.status === 200) {
                    enqueueSnackbar("Post approved successfully", {
                        variant: "success"
                    })
                } else {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error"
                    })
                }
            }).catch(err => {
                setApproveOrDeleteLoading(false)
                enqueueSnackbar("Something went wrong", {
                    variant: "error"
                })
            })
        } else {
            dispatch(deletePost(token, post?.id)).then(res => {
                setApproveOrDeleteLoading(false)
                if (res.status === 400) {
                    enqueueSnackbar("Post is already deleted", {
                        variant: "error"
                    })
                } else if (res.status === 404) {
                    enqueueSnackbar("Post not found", {
                        variant: "error"
                    })
                } else if (res.status === 200) {
                    enqueueSnackbar("Post deleted successfully", {
                        variant: "success"
                    })
                } else {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error"
                    })
                }
            }).catch(err => {
                setApproveOrDeleteLoading(false)
                enqueueSnackbar("Something went wrong", {
                    variant: "error"
                })
            })
        }
    }

    const handleDeclineOrIgnore = () => {
        setDeclineOrIgnoreLoading(true)
        if (postApproval) {
            dispatch(deletePost(token, post?.id)).then(res => {
                setDeclineOrIgnoreLoading(false)
                if (res.status === 400) {
                    enqueueSnackbar("Post is already deleted", {
                        variant: "error"
                    })
                } else if (res.status === 404) {
                    enqueueSnackbar("Post not found", {
                        variant: "error"
                    })
                } else if (res.status === 200) {
                    enqueueSnackbar("Post deleted successfully", {
                        variant: "success"
                    })
                } else {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error"
                    })
                }
            }).catch(err => {
                setDeclineOrIgnoreLoading(false)
                enqueueSnackbar("Something went wrong", {
                    variant: "error"
                })
            })
        } else if (postReport) {
            dispatch(ignoreReports(token, post?.id)).then(res => {
                setDeclineOrIgnoreLoading(false)
                if (res.status === 400) {
                    enqueueSnackbar("Post is already deleted", {
                        variant: "error"
                    })
                } else if (res.status === 404) {
                    enqueueSnackbar("Post not found", {
                        variant: "error"
                    })
                } else if (res.status === 200) {
                    enqueueSnackbar("Post deleted successfully", {
                        variant: "success"
                    })
                } else {
                    enqueueSnackbar("Something went wrong", {
                        variant: "error"
                    })
                }
            }).catch(err => {
                setDeclineOrIgnoreLoading(false)
                enqueueSnackbar("Something went wrong", {
                    variant: "error"
                })
            })
        }
    }

    const togglePostLike = () => {
        dispatch(toggleLikePost(token, post.id, user)).then(res => {
            if (res.status === 200) {
                setLiked(prevLiked => !prevLiked)
            } else {
            }
        }).catch(err => setLiked(prevLiked => !prevLiked)
        )
    }

    const togglePostSave = () => {
        dispatch(toggleSavePost(token, post.id, userId)).then(res => {
            if (res.status === 200) {
                setSaved(prevSaved => !prevSaved)
            } else {
            }
        }).catch(err => setSaved(prevSaved => !prevSaved)
        )
    }

    return (
        <div
            key={key}
            className='flex flex-col bg-white w-full rounded-lg shadow-md mt-4'
        >
            {
                (post.isAssignment || post?.isAnnouncement) && (
                    <div className="flex px-4 p-2 items-center justify-between bg-lightOrange rounded-t-lg w-full">
                        <div className="flex items-center w-3/4">
                            <Avatar className="bg-secondaryOrange h-8 w-8 sm:h-10 sm:w-10 text-white">{post?.isAnnouncement ? <GrAnnounce className="text-white" /> : <FiBook className="text-white" />}</Avatar>
                            <p className="font-semibold ml-2 sm:ml-3 text-xs sm:text-sm lg:text-md">{post?.isAnnouncement ? "Announcement" : "Assignment"}</p>
                        </div>
                        {post.isAssignment && <p className="text-[10px] text-textColor font-bold">{convertToDueByFormat(post?.assignmentDueDate)}</p>}
                    </div>
                )
            }
            <div className="p-4 py-2">
                <div className='flex items-center justify-between w-full'>
                    <div className='flex mt-2'>
                        <Avatar src={post?.authorImage} alt={post.authorName} />
                        <div className='flex flex-col justify-between ml-2'>
                            <p className='font-bold text-sm cursor-pointer' onClick={() => { push(`/home/profile/${post?.authorId}`) }}>{`${post.authorName} (${post.authorRole === "Student" ? post?.authorRoleNumber : post.authorRole})`}</p>
                            <span className='text-bgContrast text-[12px]'>{timeAgo}</span>
                        </div>
                    </div>
                    {
                        !(postApproval || postReport) && <div>
                            <Tooltip enterDelay={1500} title='Actions'>
                                <IconButton
                                    onClick={toggleHandleClick}
                                    size='small'
                                    sx={{ ml: 2 }}
                                    aria-controls={open ? 'account-menu' : undefined}
                                    aria-haspopup='true'
                                    aria-expanded={open ? 'true' : undefined}
                                >
                                    <HiDotsHorizontal />
                                </IconButton>
                            </Tooltip>
                            {
                                <StyledMenu
                                    id='demo-customized-menu'
                                    MenuListProps={{
                                        'aria-labelledby': 'demo-customized-button',
                                    }}
                                    anchorEl={anchorEl}
                                    open={open}
                                    onClose={handleClose}
                                >
                                    {
                                        (role !== "Admin" && role !== "Superadmin") && post?.authorId !== user._id  &&
                                        <MenuItem onClick={() => setOpenReportDialog(true)} disableRipple>
                                            Report
                                        </MenuItem>
                                    }
                                    {
                                        (role === "Admin" || role === "Superadmin") && post?.authorId !== user._id  &&
                                        <MenuItem onClick={() => {
                                            dispatch(deletePost(token, post?.id)).then(res => {
                                                console.log(res.status)
                                                if (res.status !== 200) {
                                                    enqueueSnackbar("Something wend wrong while deleting post.", { variant: "error" });
                                                } else {
                                                    enqueueSnackbar("Post deleted successfully.", { variant: "success" });
                                                    handleClose()
                                                }
                                            }).catch(err => {
                                                enqueueSnackbar("Something wend wrong while deleting post.", { variant: "error" });
                                            })
                                        }} disableRipple>
                                            Delete
                                        </MenuItem>
                                    }
                                    <MenuItem onClick={(e) => handleCopyPostLink(e)} disableRipple>
                                        Copy link to post
                                    </MenuItem>
                                </StyledMenu>
                            }

                        </div>
                    }

                </div>
                {
                    post.content !== "" && (
                        <p className='mt-3 text-xs text-bgContrast'>
                            {post.content}
                        </p>
                    )
                }
                {post.mediaType === 'image' ? (
                    post.media?.length === 0 ? null : post.media?.length === 1 ? (
                        <div className='mt-4' onClick={() => setShowAttachmentViewer(true)}>
                            <img
                                src={post.media[0]}
                                alt='Post Image'
                                className='w-full h-72 md:h-96 object-cover rounded-sm cursor-pointer'
                            />
                        </div>
                    ) : post.media?.length === 2 ? (
                        <div
                            className='flex gap-2'
                            onClick={() => setShowAttachmentViewer(true)}
                        >
                            {post.media?.map((mediaUrl) => (
                                <div className='mt-4'>
                                    <img
                                        src={mediaUrl}
                                        alt='Post Image'
                                        className='h-72 md:h-96 object-cover rounded-sm cursor-pointer'
                                    />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div
                            className='flex gap-2'
                            onClick={() => setShowAttachmentViewer(true)}
                        >
                            <div className='mt-4'>
                                <img
                                    src={post.media[0]}
                                    alt='Post Image'
                                    className='h-72 md:h-96 object-cover cursor-pointer'
                                />
                            </div>
                            <div className='flex flex-col justify-between'>
                                <img
                                    src={post.media[1]}
                                    alt='Post Image'
                                    className='mt-4 h-36 md:h-48 object-cover cursor-pointer'
                                />
                                <div className='h-36 md:h-44 w-full cursor-pointer relative'>
                                    <div
                                        className='bg-black h-full w-full opacity-40 hover:opacity-60'
                                        style={{ transition: 'opacity 0.3s' }}
                                    ></div>
                                    <p
                                        className='absolute top-[33%] xs:top-[40%] left-[18%] xs:left-[20%] sm:left-[24%] md:left[22%] text-xl font-bold text-bgContrast cursor-pointer hover:text-gray-300 transition-colors'
                                        onMouseEnter={(e) => {
                                            e.target.previousSibling.style.opacity = 0.6;
                                        }}
                                        onMouseLeave={(e) => {
                                            e.target.previousSibling.style.opacity = 0.4;
                                        }}
                                    >
                                        {post.media?.length - 2} + more
                                    </p>
                                </div>
                            </div>
                        </div>
                    )
                ) : post.media?.length > 0 ? (
                    <div className='flex flex-wrap gap-2 my-3'>
                        {post.media?.map((file, index) => (
                            <div className='h-40 w-[30%] flex flex-col items-center mt-4 justify-between rounded-lg shadow-md cursor-default'>
                                <div className='w-full flex'>
                                    <Tooltip enterDelay={1500} title='download'>
                                        <a
                                            target='_blank'
                                            href={file}
                                            download
                                            className='cursor-pointer ml-auto mr-2 mt-2 '
                                        >
                                            <HiOutlineDownload className=' text-xl sm:text-2xl text-secondaryOrange' />
                                        </a>
                                    </Tooltip>
                                </div>
                                <ImFileText2 className='text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-secondaryOrange' />
                                <p className='text-[10px] xs:text-xs md:text-sm text-center font-semibold mt-2 mb-4'>
                                    {
                                        <TruncatedTextWithTooltip
                                            text={file.split('/').pop()}
                                            maxLength={10}
                                        />
                                    }
                                </p>
                            </div>
                        ))}
                    </div>
                ) : null}
                {post.likes?.length > 0 && !postApproval && (
                    <div className="flex items-center my-2">
                        <AiTwotoneLike className="text-primaryBlue" />
                        <p onClick={() => setShowLikeDialog(true)} className='ml-1 text-xs hover:underline cursor-pointer'>{post.likes?.length === 1 ? `Liked by ${liked ? "you" : post.likes[0].name}` : `Liked by ${liked ? "You" : post.likes[0].name} and ${post.likes?.length - 1} ${post.likes?.length === 2 ? 'other' : 'others'}`}</p>
                    </div>
                )}
                <Divider className="mb-2" />
                {
                    !(postApproval || postReport) ?
                        <div className="flex items-between justify-between">
                            <Tooltip enterDelay={1500} title={dimensions.width > 400 ? "" : "Like"}>
                                <button className={`${liked && "text-primaryBlue"} transition-colors delay-200 w-[32%] flex items-center justify-center h-10 hover:bg-main rounded-md text-bgContrast`} onClick={togglePostLike}>
                                    {liked ? <AiTwotoneLike className="text-lg" /> : <AiOutlineLike className="text-lg" />}

                                    {dimensions.width > 400 ? <p className="text-xs ml-1">{`${post.likes?.length} ${(post.likes?.length === 0 || post.likes?.length === 1) ? "Like" : "Likes"}`}</p> : <p className="text-xs ml-1">{post.likes?.length}</p>}
                                </button>
                            </Tooltip>
                            <Tooltip enterDelay={1500} title={dimensions.width > 400 ? "" : "Comment"}>
                                <button className="w-[32%] flex items-center justify-center h-10 hover:bg-main rounded-md text-bgContrast" onClick={() => setShowCommentDialog(true)}>
                                    <FaRegComment className="text-lg" />
                                    {dimensions.width > 400 ? <p className="text-xs ml-1">{`${post.comments?.length} ${(post.comments?.length === 0 || post.comments?.length === 1) ? "Comment" : "Comments"}`}</p> : <p className="text-xs ml-1">{post.comments?.length}</p>}
                                </button>
                            </Tooltip>
                            {
                                !classroom && (
                                    <Tooltip enterDelay={1500} title={dimensions.width > 400 ? "" : "Save"}>
                                        <button onClick={togglePostSave} className={`${saved && "text-secondaryOrange"} transition-colors delay-200 w-[32%] flex items-center justify-center h-10 hover:bg-main rounded-md text-bgContrast`}>
                                            <BiSave className={`text-lg `} />
                                            {dimensions.width > 400 ? <p className="text-xs ml-1">{`${post.saves?.length} ${(post.saves?.length === 0 || post.saves?.length === 1) ? "Save" : "Saves"}`}</p> : <p className="text-xs ml-1">{post.saves?.length}</p>}
                                        </button>
                                    </Tooltip>
                                )
                            }
                        </div> : <div className={`flex items-center ${postReport ? "justify-between" : "justify-end"}`}>
                            {
                                postReport && (
                                    <p className="hover:underline font-semibold cursor-pointer" onClick={() => setShowReportDialog(true)}>See all reports</p>
                                )
                            }
                            <div className="flex items-center">
                                <button className="bg-red-500 hover:bg-red-200 transition px-4 font-normal py-2 mr-3 rounded-lg text-white flex items-center" onClick={handleDeclineOrIgnore}>
                                    {declineOrIgnoreLoading && <SmallSpinnerLoader />}
                                    <p className={`${declineOrIgnoreLoading && "ml-1"}`}>           {postApproval ? "Decline" : "Ignore"}
                                    </p>
                                </button>
                                <button onClick={handleApproveOrDeletePost} className="bg-primaryBlue hover:bg-lightBlue transition px-4 font-normal py-2 rounded-lg text-white flex items-center">
                                    {approveOrDeleteLoading && <SmallSpinnerLoader />}
                                    <p className={`${approveOrDeleteLoading && "ml-1"}`}>           {postApproval ? "Approve" : "Delete"}
                                    </p>
                                </button>
                            </div>
                        </div>
                }
                {showAttachmentViewer && (
                    <AttachmentViewer
                        attachmentObject={post?.media}
                        onClose={() => setShowAttachmentViewer(false)}
                    />
                )}
                <ReportDialog showReportDialog={showReportDialog} setShowReportDialog={setShowReportDialog} reporters={post?.reports} />
                <LikeDialog showLikeDialog={showLikeDialog} setShowLikeDialog={setShowLikeDialog} post={post} />
                <CommentDialog showCommentDialog={showCommentDialog} setShowCommentDialog={setShowCommentDialog} comments={post.comments} postId={post.id} />

                <SendReportDialog open={openReportDialog} onClose={() => setOpenReportDialog(false)} postId={post.id} />
            </div>
        </div>
    );
};

export default PostUi;
