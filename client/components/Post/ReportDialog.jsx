import { Avatar, Dialog, DialogContent, DialogTitle } from '@mui/material'
import React from 'react'
import { useRouter } from 'next/navigation';

const ReportDialog = ({ showReportDialog, setShowReportDialog, reporters }) => {
    const { push } = useRouter();

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
        <Dialog open={showReportDialog} onClose={() => setShowReportDialog(false)} classes={{ paper: 'custom-dialog' }}>
            <DialogTitle className='text-textColor font-semibold'>Reports</DialogTitle>
            <DialogContent>
                {reporters?.map(report => (
                    <div onClick={() => { push(`/home/profile/${report?.reporterId}`) }} key={report?.reporterId} className="flex items-center mb-2 border border-x-0 border-t-0 p-2 cursor-pointer hover:bg-mainHover">
                        <Avatar src={report?.reporterImage} alt={report?.reporterName} className='w-12 h-12' style={{
                            backgroundColor:
                                avatarColors[Math.floor(Math.random() * avatarColors.length)],
                        }}></Avatar>
                        <div className="flex flex-col ml-2">
                        <p className='text-md font-semibold'>{report?.reporterName}</p>
                        <p className='text-sm'>{report?.reason}</p>
                        </div>
                    </div>
                ))
                }
            </DialogContent>
        </Dialog>
    )
}

export default ReportDialog