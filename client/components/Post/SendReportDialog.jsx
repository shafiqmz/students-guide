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
  import axios from 'axios';
import Loading from '../General/Loading';
import SentForVerificationLottie from '../General/SentForVerificationLottie';
import ServerErrorLottie from '../General/ServerErrorLottie';
import ErrorLottie from '../General/ErrorLottie';
  
  export const SendReportDialog = ({ open, onClose, postId }) => {
    const [errorType, setErrorType] = useState("");
    const [loading, setLoading] = useState(false);
    const [reason, setReason] = useState('');
    const token = JSON.parse(localStorage.getItem("token"))

  
    const handleSendReport = () => {
      setLoading(true)
      axios.post(`http://localhost:4000/api/posts/report/${postId}`, {reason}, {headers: {Authorization: `Bearer ${token}`}}).then((res) => {
        const type =
        res.status === 400
          ? 'Already Reported'
          : res.status === 200
            ? 'Ok'
            : 'Server';
            setErrorType(type);
            setLoading(false);
      }).catch((error) => {
        const type = error.response.status === 400
          ? 'Already Reported'
          : error.response.status === 200
            ? 'Ok'
            : 'Server';
            
        setErrorType(type)
        setLoading(false)
      })
    }
  
    return (
      <Dialog open={open} onClose={onClose} classes={{ paper: 'custom-dialog' }}>
        <DialogTitle className='text-textColor'>Report post</DialogTitle>
        <DialogContent>
          {loading ? <Loading height={200} /> : errorType === "Already Reported" ? (
            <div className='flex flex-col justify-center'>
              <ErrorLottie height={200} />
              <h4 className='mt-2 font-semibold'>
                You have already reported this post.
              </h4>
            </div>
          ) : errorType === "Ok" ? (
            <div className='flex flex-col justify-center'>
              <SentForVerificationLottie height={200} />
              <h4 className='mt-2 font-semibold'>
                Reported to admins.
              </h4>
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
              id='reason'
              label='Reason to report'
              type='reason'
              fullWidth
              required
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className='mt-4'
            />
           : null}
        </DialogContent>
        {errorType === "" && (
          <DialogActions>
            <Button onClick={onClose}>Cancel</Button>
            <Button
              onClick={handleSendReport}
            >
              Report
            </Button>
          </DialogActions>
        )}
      </Dialog>
    );
  };
  