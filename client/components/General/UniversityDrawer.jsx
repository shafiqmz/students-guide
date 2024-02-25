import { Drawer, Divider, TextField, MenuItem } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { IoMdClose } from '@react-icons/all-files/io/IoMdClose';
import { AttachmentViewer } from './AttachmentViewer';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import SmallSpinnerLoader from './SmallSpinnerLoader';

const UniversityDrawer = ({ open, onClose, drawerData, fetchUniversityList }) => {
    const [approved, setApproved] = useState(null);
    const [showAttachment, setShowAttachment] = useState(false);
    const token = JSON.parse(localStorage.getItem('token'));
    const [loading, setLoading] = useState(false);
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        if (drawerData) {
            setApproved(drawerData?.isApproved);
        }
    }, [drawerData]);

    const saveData = () => {
        setLoading(true);
        const apiUrl = `${process.env.API_URL}university/${drawerData?._id}/approve`;
        axios
            .put(
                apiUrl,
                {
                    isApproved: approved,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                setLoading(false);
                enqueueSnackbar('Successfully edited user data.', {
                    variant: 'success',
                });
                fetchUniversityList();
            })
            .catch((error) => {
                setLoading(false);
                enqueueSnackbar('Something went wrong while updating user.', {
                    variant: 'error',
                });
            });
    };

    const approval = [
        {
            label: 'Approve',
            value: true,
        },
        {
            label: 'Decline',
            value: false,
        },
    ];

    return (
        <Drawer
            open={open}
            onClose={onClose}
            anchor='right'
            classes={{ paper: 'drawer-width' }}
        >
            <div className='flex justify-between items-center px-4 mt-4'>
                <IoMdClose
                    onClick={onClose}
                    className='text-xl hover:text-red-600 cursor-pointer  transition hover:scale-125 hover:rotate-90'
                />
                <button
                    disabled={loading || drawerData?.isApproved}
                    className='px-3 py-1 text-md rounded-lg transition bg-green-500 hover:bg-green-400 text-white font-normal flex items-center'
                    onClick={saveData}
                >
                    {loading && <SmallSpinnerLoader />}
                    <p className={`${loading && 'ml-2'}`}>Save</p>
                </button>
            </div>
            <Divider className='my-2' />
            <div className='flex flex-col px-4'>
                <img
                    src={drawerData?.hecLicenseImage}
                    alt='HEC License Image'
                    className='w-full object-cover rounded-lg my-4 h-52'
                    onClick={() => {
                        setShowAttachment(true);
                    }}
                />
                <TextField
                    name='name'
                    label='Name'
                    value={drawerData?.name}
                    fullWidth
                    disabled
                    className='mt-4'
                />
                <TextField
                    name='email'
                    label='Email'
                    value={drawerData?.domainEmail}
                    fullWidth
                    disabled
                    className='mt-4'
                />

                <TextField
                    select
                    name='approve'
                    label='Approve'
                    value={approved}
                    onChange={(e) => setApproved(e.target.value)}
                    className='mt-4'
                    disabled={drawerData?.isApproved}
                >
                    {approval.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                    ))}
                </TextField>
            </div>
            {showAttachment && (
                <AttachmentViewer
                    onClose={() => setShowAttachment(false)}
                    attachmentObject={{
                        url: drawerData?.hecLicenseImage,
                        name: 'University Verification Image',
                    }}
                />
            )}
        </Drawer>
    );
};

export default UniversityDrawer;
