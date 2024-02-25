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
import { useEffect, useState } from 'react';

export default function NotAuthorized({ height, open, onClose, message }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsLoggedIn(localStorage.getItem('token') !== null);
    }
  }, []);

  return (
    <Dialog open={open} classes={{ paper: 'custom-dialog' }}>
      <DialogTitle className='text-textColor'>Not Authorized.</DialogTitle>
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
              message ? message : isLoggedIn ? "Looks like you are trying to access a page which you don't have access to." : "You're not logged in. Login first."
            }
          </p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => {
            onClose();
            if (isLoggedIn) {
              router.back();
            } else {
              router.push("/login")
            }
          }}
        >
          Go Back
        </Button>
      </DialogActions>
    </Dialog>
  );
}
