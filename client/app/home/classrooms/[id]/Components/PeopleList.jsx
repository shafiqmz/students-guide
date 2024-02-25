import React, { useState } from 'react'
import { Avatar, Divider, Snackbar } from '@mui/material';
import { useSelector } from 'react-redux';
import { FaRegCopy } from "@react-icons/all-files/fa/FaRegCopy"
import { useRouter } from 'next/navigation';
import BootstrapTable from 'react-bootstrap-table-next';
import useGetRole from '@/components/General/CustomHooks/useGetRole';
import axios from 'axios';
import { useSnackbar } from 'notistack';

const PeopleList = ({ classroomUsers, id, fetchClassroomUsers }) => {
    const userInfo = useSelector(state => state.user.userInfo)
    const [openSnackbar, setOpenSnackbar] = useState(false)
    const { push } = useRouter();
    const role = useGetRole();
    const token = JSON.parse(localStorage.getItem("token"))
    const {enqueueSnackbar} = useSnackbar();
    const [removeLoading, setRemoveLoading] = useState(false)
    const [approveLoading, setApproveLoading] = useState(false)

    const copyClassroomLinkToClipboard = () => {
        const classroomLink = `http://localhost:3000/home/classrooms/join/${id}`;

        const textArea = document.createElement("textarea");
        textArea.value = classroomLink;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setOpenSnackbar(true)
        setTimeout(() => setOpenSnackbar(false), 2000);
    }

    const handleRemoveUser = (userId) => {
        const payload = {
            userId: userId,
            classroomId: id
        }

        axios.put(`${process.env.API_URL}classroom/remove-user`, payload, {headers: {Authorization: `Bearer ${token}`}})
            .then((res) => {
                setRemoveLoading(true)
                if (res.status === 200) {
                    enqueueSnackbar("User removed successfully", {variant: "success"})
                    fetchClassroomUsers(); 
                } else {
                    enqueueSnackbar("Something went wrong while removing user", {variant: "error"})
                }
            })
            .catch((err) => {
                enqueueSnackbar("Something went wrong while removing user", {variant: "error"})
            })
            .finally(() => {
                setRemoveLoading(false)
            })
    }

    const handleApproveUser = (userId) => {
        const payload = {
            userId: userId,
            classroomId: id
        }

        axios.put(`${process.env.API_URL}classroom/approve-user`, payload, {headers: {Authorization: `Bearer ${token}`}})
            .then((res) => {
                setApproveLoading(true)
                if (res.status === 200) {
                    enqueueSnackbar("User Approved successfully", {variant: "success"})
                    fetchClassroomUsers(); 
                } else {
                    enqueueSnackbar("Something went wrong while approving user", {variant: "error"})
                }
            })
            .catch((err) => {
                enqueueSnackbar("Something went wrong while approving user", {variant: "error"})
            })
            .finally(() => {
                setApproveLoading(false)
            })
    }

    const columns = [
        {
            dataField: 'profilePicture',
            text: 'Avatar',
            formatter: (cell, row) => {
                return (
                    <Avatar
                        className='w-8 h-8 mx-auto'
                        src={row?.profilePicture}
                        alt={row?.name}
                    />
                );
            },
            headerStyle: { width: '80px', textAlign: 'center' },
            style: { width: '80px' },
        },
        {
            dataField: 'name',
            text: 'Name',
            headerStyle: { width: '150px', textAlign: 'center' },
            style: { width: '150px' },
            formatter: (cell, row) => {
                return (
                    <div onClick={() => push(`/home/profile/${row?._id}`)} className="cursor-pointer hover:underline">{`${row?.name} (${row?.roleNumber})`}</div>
                );
            },
        },
        {
            dataField: 'email',
            text: 'Email',
            headerStyle: { width: '250px', textAlign: 'center' },
            style: { width: '250px' },
        },
    ];

    if (role === 'Teacher') {
        columns.push(
        {
            dataField: 'action',
            text: 'Remove',
            headerStyle: { width: '100px' },
            style: { width: '100px' },
            formatter: (cell, row) => {
                return (
                    <button
                        disabled={removeLoading}
                        onClick={() => {
                            handleRemoveUser(row?._id);
                        }}
                        className='bg-red-600 text-white px-3 py-1 rounded-md w-100 hover:bg-red-400 transition-colors'
                    >
                        Remove
                    </button>
                );
            },
        },
        {
            dataField: 'action',
            text: 'Approval',
            headerStyle: { width: '100px' },
            style: { width: '100px' },
            formatter: (cell, row) => {
                return (
                    <button
                        disabled={row?.isApproved || approveLoading}
                        onClick={() => {
                            handleApproveUser(row?._id);
                        }}
                        className={`${row?.isApproved ? "bg-green-500" : "bg-blue-600"} text-white px-3 py-1 rounded-md w-100 transition-colors`}
                    >
                        {row?.isApproved ? "Approved" : "Approve"}
                    </button>
                );
            },
        },

        );
    }


    return (
        <div className='flex flex-col'>
            <div>
                <h4 className="pb-3 md:pb-5 border-b-2 border-primaryBlue font-semibold text-primaryBlue pl-2 md:pl-3 mb-3 md:mb-4 text-xl md:text-2xl">Teacher</h4>
                <div className="flex flex-col">
                    <div className="flex items-center">
                        <Avatar className="w-6 h-6 md:w-8 md:h-8 " src={classroomUsers["teacher"].profilePicture} alt={classroomUsers["teacher"].name} />
                        <p onClick={() => push(`/home/profile/${classroomUsers["teacher"]._id}`)} className="ml-3 text-textColor text-sm md:text-md font-semibold cursor-pointer hover:underline">{classroomUsers["teacher"].name}</p>
                    </div>
                </div>
            </div>
            <div className="mt-12">
                <div className="w-100 flex justify-between items-center pb-3 md:pb-5 border-b-2 border-primaryBlue  pl-2 md:pl-3 mb-3 md:mb-4">
                    <h4 className="font-semibold text-primaryBlue text-xl md:text-2xl">{userInfo?.role === "Teacher" ? "Students" : "Classmates"}</h4>
                    {
                        userInfo?.role === "Student" ? (
                            <p className="text-xs text-primaryBlue">{classroomUsers.students?.length} Student{classroomUsers.students?.length > 1 && 's'}</p>
                        ) :
                            <div onClick={copyClassroomLinkToClipboard}
                                className='p-3 transition-all hover:bg-mainHover rounded-full cursor-pointer'>
                                <FaRegCopy className='cursor-pointer text-primaryBlue text-xl ease-linear  transition-all delay-200' />
                            </div>}
                </div>
                <div className='bg-white p-6 rounded-3xl overflow-x-scroll'>
                    <BootstrapTable keyField='_id' data={classroomUsers?.students} columns={columns} />
                </div>
            </div>

            <Snackbar
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                open={openSnackbar}
                autoHideDuration={2000}
                message="Classroom invite Link copied"
            />
        </div>
    )
}

export default PeopleList