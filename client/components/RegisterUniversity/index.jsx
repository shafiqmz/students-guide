import { Button, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import * as Yup from 'yup';
import { FormikWizard } from 'formik-wizard-form';
import { useState } from 'react';
import UniversityData from './UniversityData';
import Other from './Other';
import { useDispatch } from 'react-redux';
import UserExistsLottie from '../General/UserExistsLottie';
import Loading from '../General/Loading';
import ServerErrorLottie from '../General/ServerErrorLottie';
import { registerUniversity } from '@/redux/features/University/universityActions';
import SentForVerificationLottie from '../General/SentForVerificationLottie';

export const RegisterUniversity = ({ open, onClose }) => {
  const [finalValues, setFinalValues] = useState({});
  const [finished, setFinished] = useState(false);
  const [dispatchedForm, setDispatchedForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorType, setErrorType] = useState();
  const dispatch = useDispatch();

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: 'custom-dialog' }}>
      <DialogTitle className='text-textColor'>
        University Registeration
      </DialogTitle>
      <DialogContent>
        {loading ? (
          <div className='flex flex-col justify-center'>
            <Loading height={200} />
          </div>
        ) : errorType && errorType === 'UserExists' ? (
          <div className='flex flex-col justify-center'>
            <UserExistsLottie height={200} />
            <h4 className='mt-2 font-semibold'>University already exists.</h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              The account domain already exists in our database.
            </p>
          </div>
        ) : errorType === 'Server' ? (
          <div className='flex flex-col justify-center'>
            <ServerErrorLottie height={200} />
            <h4 className='mt-2 font-semibold'>Some Error Occured.</h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              Seems like there is a problem with your network or server. If it
              keeps occuring, please let us know via email.
            </p>
          </div>
        ) : dispatchedForm ? (
          <div className='flex flex-col justify-center'>
            <SentForVerificationLottie height={200} />
            <h4 className='mt-2 font-semibold'>
              University sent for approval.
            </h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              We will notify you once our management approves your University.
            </p>
          </div>
        ) : (
          <FormikWizard
            initialValues={{
              name: '',
              domainEmail: '',
              province: '',
              universityImages: [],
              websiteUrl: '',
              isApproved: false,
              hecLicenseImage: '',
              representativeName: '',
              representativeEmail: '',
            }}
            onSubmit={(values) => {
              setFinalValues(values);
              setFinished(true);
              setDispatchedForm(true);
              setLoading(true);
              const formData = new FormData();
              formData.append('name', values.name);
              formData.append('domainEmail', values.domainEmail);
              formData.append('province', values.province);
              formData.append('websiteUrl', values.websiteUrl);
              formData.append('hecLicenseImage', values.hecLicenseImage);
              formData.append('representativeName', values.representativeName);
              formData.append(
                'representativeEmail',
                values.representativeEmail
              );

              if (
                values.universityImages &&
                values.universityImages.length > 0
              ) {
                for (let i = 0; i < values.universityImages.length; i++) {
                  formData.append(
                    'universityImages',
                    values.universityImages[i]
                  );
                }
              }

              dispatch(registerUniversity(formData)).then((res) => {
                const type =
                  res.status === 409
                    ? 'UserExists'
                    : res.status === 201
                    ? 'Ok'
                    : 'Server';
                setErrorType(type);
                setLoading(false);
              });
              setDispatchedForm(true);
            }}
            validateOnNext
            activeStepIndex={0}
            steps={[
              {
                component: UniversityData,
                validationSchema: Yup.object().shape({
                  name: Yup.string().required('Please provide university name'),
                  domainEmail: Yup.string()
                    .matches(
                      /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
                      'Invalid domain format, the correct format is like; i.e. usindh.edu.pk'
                    )
                    .required('Domain email is required'),
                  province: Yup.string().required('Select your province name'),
                  websiteUrl: Yup.string()
                    .url('Invalid URL; i.e, https://www.usindh.edu.pk')
                    .required('Website URL is required'),
                }),
              },
              {
                component: Other,
                validationSchema: Yup.object().shape({
                  hecLicenseImage: Yup.string().required(
                    'HEC license image is required'
                  ),
                  representativeName: Yup.string().required(
                    'Representative name is required'
                  ),
                  representativeEmail: Yup.string()
                    .email('Invalid email address')
                    .required('Representative email is required'),
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
                        <StepLabel>Let us know about your University</StepLabel>
                      </Step>
                      <Step completed={finished}>
                        <StepLabel>Other</StepLabel>
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
