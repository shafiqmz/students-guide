import { Button, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import * as Yup from 'yup';
import { FormikWizard } from 'formik-wizard-form';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import Loading from '../General/Loading';
import ServerErrorLottie from '../General/ServerErrorLottie';
import JobInfo from './JobInfo';
import JobDesc from './JobDesc';
import axios from 'axios';
import SentForVerificationLottie from '../General/SentForVerificationLottie';

export const CreateJob = ({ open, onClose }) => {
  const [finalValues, setFinalValues] = useState({});
  const [finished, setFinished] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState();
  const dispatch = useDispatch();

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: 'custom-dialog' }}>
      <DialogTitle className='text-textColor'>
        Create a Job
      </DialogTitle>
      <DialogContent sx={{ overflowX: 'hidden' }}>
        {loading ? (
          <div className='flex flex-col justify-center'>
            <Loading height={200} />
          </div>
        ) : errorType === 'Error' ? (
          <div className='flex flex-col justify-center'>
            <ServerErrorLottie height={200} />
            <h4 className='mt-2 font-semibold'>Some Error Occured.</h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              Seems like there is a problem with your network or server. If it
              keeps occuring, please let us know via email.
            </p>
          </div>
        ) : errorType === 'Ok' ? (
          <div className='flex flex-col justify-center'>
            <SentForVerificationLottie height={200} />
            <h4 className='mt-2 font-semibold'>Job Created Successfully.</h4>
          </div> ) : (
          <FormikWizard
            initialValues={{
              jobTitle: '',
              location: '',
              companyName: '',
              type: '',
              mode: '',
              range: [50, 100],
              contactEmail: '',
              jobDescription: '',
            }}
            onSubmit={(values) => {
              setFinalValues(values);
              setFinished(true);
              setLoading(true);
              axios.post(`${process.env.API_URL}jobs/create`, values).then(res => {
                if (res.status === 201) {
                  setErrorType("Ok")
                } else {
                  setErrorType("Error")
                }
                setLoading(false)
              }).catch(error => {
                setErrorType("Error")
                setLoading(false)
              })
            }}
            validateOnNext
            activeStepIndex={0}
            steps={[
              {
                component: JobInfo,
                validationSchema: Yup.object().shape({
                  jobTitle: Yup.string().required('Please provide Job Title'),
                  companyName: Yup.string().required('Please provide Company Name'),
                  location: Yup.string().required('Please provide Job Location'),
                  type: Yup.string().required('Please provide Job Type'),
                  mode: Yup.string().required('Please provide Job Mode'),
                  contactEmail: Yup.string()
                    .email('Please enter valid email')
                    .required('Contact Email is required'),
                
                }),
              },
              {
                component: JobDesc,
                validationSchema: Yup.object().shape({
                  jobDescription: Yup.string().required(
                    'Job Description is required'
                  ),
                }),
              },
            ]}
          >
            {({
              currentStepIndex,
              renderComponent,
              handlePrev,
              handleNext,
              isNextDisabled,
              isPrevDisabled,
            }) => {
              return (
                <>
                  <Box sx={{ width: '100%', my: '1rem' }}>
                    <Stepper activeStep={currentStepIndex}>
                      <Step completed={currentStepIndex > 0}>
                        <StepLabel>Job Info</StepLabel>
                      </Step>
                      <Step completed={finished}>
                        <StepLabel>Job Description</StepLabel>
                      </Step>
                    </Stepper>
                  </Box>
                  <Box my='2rem'>{renderComponent()}</Box>
                  <Box display='flex' justifyContent='space-between'>
                    <Button
                      variant='contained'
                      disabled={isPrevDisabled}
                      type='primary'
                      onClick={handlePrev}
                    >
                      Previous
                    </Button>
                    <Button
                      variant='contained'
                      disabled={isNextDisabled}
                      type='primary'
                      onClick={handleNext}
                    >
                      {currentStepIndex === 1 ? 'Finish' : 'Next'}
                    </Button>
                  </Box>
                </>
              );
            }}
          </FormikWizard>
        )}
      </DialogContent>
    </Dialog>
  );
};
