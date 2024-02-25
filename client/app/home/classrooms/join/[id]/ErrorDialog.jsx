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
import SentForVerificationLottie from '@/components/General/SentForVerificationLottie';

export default function ErrorDialog({ height, open, onClose, errorCode, id }) {
  const {push} = useRouter();

  return (
    <Dialog open={open} classes={{ paper: 'custom-dialog' }}>
      <DialogTitle className='text-textColor'>{errorCode === 401 ? "Not Authorized" : errorCode === 200 ? "Sent for approval" : errorCode === 400 ? "Already enrolled" : errorCode === 404 ? "Classroom Not Found" : errorCode === 402 ? "We can't find you in this class" : errorCode === 405 ? "Your enrollment is pending" : "Internal Server Error"}</DialogTitle>
      <DialogContent>
        <div className='flex flex-col justify-center'>
        {
          errorCode === 200 ? <SentForVerificationLottie height={200} /> : <div className='flex flex-col w-full justify-center items-center'>
            <Lottie
              animationData={animationData}
              className='flex justify-center items-center'
              loop={true}
              style={{ height: height }}
            />
          </div>
        }
          
          <p className='mt-1 font-medium text-sm text-primaryBlue'>
            {
              errorCode === 401 ? "You're not authorized to access this route." : errorCode === 200 ? "Your enrollment sent for approval" : errorCode === 400 ? "You're already enrolled in this classroom" : errorCode === 404 ? "Classroom not found" : errorCode === 402 ? "Looks like you're not member of this classroom. Request the concerned person for the link to join the classroom" : errorCode === 405 ? "Your request hasn't been approved by concerned person. Please wait" : "Internal server error."
            }
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            if (errorCode === 400) {
                push(`/home/classrooms/${id}`)
            } else {
                push(`/home`)
            }
            onClose();
          }}
        >
          {errorCode === 400 ? "Go to classroom" : "Go Back"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
