"use client"
import axios from 'axios';
import React, { useEffect, useState } from 'react'
import PageLoader from '@/components/General/PageLoader';
import { useRouter } from 'next/navigation';
import { useSnackbar } from 'notistack';
import ErrorDialog from './ErrorDialog';

const page = ({ params }) => {
    const id = params.id;
    const token = JSON.parse(localStorage.getItem("token"))
    const [loading, setLoading] = useState(false)
    const  { push } = useRouter();
    const { enqueueSnackbar } = useSnackbar();
    const [errorCode, setErrorCode] = useState();
    const [errorDialogOpen, setErrorDialogOpen] = useState(false);

    useEffect(() => {
        enrollInClassroom();
    }, [])

    const enrollInClassroom = () => {
        setLoading(true)
        axios.post(`${process.env.API_URL}classroom/enroll`, 
        {
            classroomId: id
        }, 
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }).then((res) => {
            if (res.status === 200) {
                setErrorDialogOpen(true);
                setErrorCode(res.status)
            }
        }).catch((error) => {
            setErrorDialogOpen(true);
            setErrorCode(error.response.status)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
            {loading && <PageLoader />}
            <ErrorDialog open={errorDialogOpen} onClose={() => setErrorDialogOpen(false)} errorCode={errorCode} id={id} />
        </>
    )
}

export default page