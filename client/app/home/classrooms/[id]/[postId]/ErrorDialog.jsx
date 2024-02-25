"use client"
import Lottie from 'lottie-react';
import animationData from '/public/Lotties/not-authorized.json';
import { useRouter } from 'next/navigation';
import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
} from '@mui/material';

export default function ErrorDialog({ height, open, onClose, errorCode }) {
    const { push } = useRouter();

    return (
        <Dialog open={open} classes={{ paper: 'custom-dialog' }}>
            <DialogTitle className='text-textColor'>{errorCode === 404 ? "Not Found" : errorCode === 403 ? "You are not member of this classroom" : "Internal Server Error"}</DialogTitle>
            <DialogContent>
                <div className='flex flex-col justify-center'>
                    <div className='flex flex-col w-full justify-center items-center'>
                        <Lottie
                            animationData={animationData}
                            className='flex justify-center items-center'
                            loop={true}
                            style={{ height: height }}
                        />
                    </div>
                    <p className='mt-1 font-medium text-sm text-primaryBlue'>
                        {
                            errorCode === 404 ? "Looks like the post is removed or deleted" : errorCode === 403 ? "Looks like you are not the member of this classroom. Join the class first and then try to access" : "Internal server error."
                        }
                    </p>
                </div>
            </DialogContent>
            <DialogActions>
                <Button
                    onClick={() => {
                        push(`/home/classrooms`)
                        onClose();
                    }}
                >
                    Classrooms
                </Button>
            </DialogActions>
        </Dialog>
    );
}
