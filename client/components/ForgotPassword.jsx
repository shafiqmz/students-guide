import {
  Button,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';
import ServerErrorLottie from './General/ServerErrorLottie';
import SentForVerificationLottie from './General/SentForVerificationLottie';
import ErrorLottie from './General/ErrorLottie';
import axios from 'axios';
import Loading from './General/Loading';

export const ForgotPassword = ({ open, onClose }) => {
  const [errorType, setErrorType] = useState("");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (email) => {
    const emailPattern = /\S+@\S+\.\S+/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (event) => {
    const newEmail = event.target.value;
    setEmail(newEmail);

    if (!validateEmail(newEmail)) {
      setEmailError('Invalid email format');
    } else {
      setEmailError('');
    }
  };

  const handleForgotPassword = () => {
    if (!validateEmail(email)) {
      setEmailError('Invalid email format');
      return;
    }

    setLoading(true)
    axios.post("http://localhost:4000/api/user/forgot-password", {email}).then((res) => {
      const type =
      res.status === 404
        ? 'Email does not exists'
        : res.status === 200
          ? 'Ok'
          : 'Server';
          setErrorType(type);
          setLoading(false);
    }).catch((error) => {
      setErrorType(error.response.status === 404 ? "Email does not exists" : "Server")
      setLoading(false)
    })
  }

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: 'custom-dialog' }}>
      <DialogTitle className='text-textColor'>Forgot Password</DialogTitle>
      <DialogContent>
        {loading ? <Loading height={200} /> : errorType === "Email does not exists" ? (
          <div className='flex flex-col justify-center'>
            <ErrorLottie height={200} />
            <h4 className='mt-2 font-semibold'>
              Your email does not exist in our database.
            </h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              Try registering yourself first.
            </p>
          </div>
        ) : errorType === "Ok" ? (
          <div className='flex flex-col justify-center'>
            <SentForVerificationLottie height={200} />
            <h4 className='mt-2 font-semibold'>
              We have sent new password to your email.
            </h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              Try resetting password.
            </p>
          </div>
        ) : errorType === "Server" ? (
          <div className='flex flex-col justify-center'>
            <ServerErrorLottie height={200} />
            <h4 className='mt-2 font-semibold'>
              Server Error.
            </h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              Looks like there is a problem with our server. We will try and fix it ASAP.
            </p>
          </div>
        ) : errorType === "" ?
          <TextField
            autoFocus
            id='email'
            label='Enter your email'
            type='email'
            fullWidth
            required
            value={email}
            onChange={handleEmailChange}
            error={Boolean(emailError)}
            helperText={emailError}
            className='mt-4'
          />
         : null}
      </DialogContent>
      {errorType === "" && (
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button
            onClick={handleForgotPassword}
          >
            Send
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
