import { Avatar, Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'

const LikeDialog = ({ showLikeDialog, setShowLikeDialog, post }) => {

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

    return (
        <Dialog open={showLikeDialog} onClose={() => setShowLikeDialog(false)} classes={{ paper: 'custom-dialog' }}>
            <DialogTitle className='text-textColor'>Liked By</DialogTitle>
            <DialogContent>
                {post.likes?.map(likedBy => (
                    <div className="flex items-center mb-2 border border-x-0 border-t-0 pb-2 cursor-default">
                        <Avatar alt={likedBy?.name} className='w-8 h-8' style={{
                            backgroundColor:
                                avatarColors[Math.floor(Math.random() * avatarColors.length)],
                        }} src={likedBy?.name}></Avatar>
                        <p className='text-md font-semibold ml-2'>{likedBy?.name}</p>

                    </div>
                ))
                }
            </DialogContent>
        </Dialog>
    )
}

export default LikeDialog