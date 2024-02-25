import { Button, Box, Dialog, DialogContent, DialogTitle } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import * as Yup from 'yup';
import { FormikWizard } from 'formik-wizard-form';
import { useEffect, useState } from 'react';
import PersonalData from './PersonalData';
import Other from './Other';
import { registerUser } from '@/redux/features/User/userActions';
import { useDispatch } from 'react-redux';
import UserExistsLottie from '../General/UserExistsLottie';
import ServerErrorLottie from '../General/ServerErrorLottie';
import Loading from '../General/Loading';
import SentForVerificationLottie from '../General/SentForVerificationLottie';
import { getApprovedUniversities } from '@/redux/features/University/universityActions';

export const Signup = ({ open, onClose }) => {
  const [finalValues, setFinalValues] = useState({});
  const [finished, setFinished] = useState(false);
  const [dispatchedForm, setDispatchedForm] = useState(false);
  const [errorType, setErrorType] = useState();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getApprovedUniversities());
  }, []);

  return (
    <Dialog open={open} onClose={onClose} classes={{ paper: 'custom-dialog' }}>
      <DialogTitle className='text-textColor'>Signing you up...</DialogTitle>
      <DialogContent>
        {loading ? (
          <div className='flex flex-col justify-center'>
            <Loading height={200} />
          </div>
        ) : errorType && errorType === 'UserExists' ? (
          <div className='flex flex-col justify-center'>
            <UserExistsLottie height={200} />
            <h4 className='mt-2 font-semibold'>Account already exists.</h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              The email you provided already exists in our database.
            </p>
          </div>
        ) : errorType === 'Server' ? (
          <div className='flex flex-col justify-center'>
            <ServerErrorLottie height={200} />
            <h4 className='mt-2 font-semibold'>Some Error Occured.</h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              Seems like there is a problem with your network or server.
            </p>
          </div>
        ) : dispatchedForm ? (
          <div className='flex flex-col justify-center'>
            <SentForVerificationLottie height={200} />
            <h4 className='mt-2 font-semibold'>
              Your account sent for approval.
            </h4>
            <p className='mt-1 font-thin text-sm text-primaryBlue'>
              We will send you email, once your university representative
              approve your request.
            </p>
          </div>
        ) : (
          <FormikWizard
            initialValues={{
              profilePicture: '',
              name: '',
              email: '',
              role: '',
              roleNumber: '',
              password: '',
              university: '',
              graduation: '',
              interests: [],
              skills: [],
              bio: '',
              roleVerificationImage: '',
              isVerified: false,
            }}
            onSubmit={(values) => {
              setFinalValues(values);
              setFinished(true);
              setLoading(true);
              const formData = new FormData();
              formData.append('profilePicture', values.profilePicture);
              formData.append('name', values.name);
              formData.append('email', values.email);
              formData.append('password', values.password);
              formData.append('role', values.role);
              formData.append('roleNumber', values.roleNumber?.toUpperCase());
              formData.append('university', values.university);
              formData.append('graduation', values.graduation);
              values.skills.forEach((skill) => {
                formData.append(`skills`, skill);
              });

              values.interests.forEach((interest) => {
                formData.append(`interests`, interest);
              });

              formData.append('bio', values.bio);
              formData.append(
                'roleVerificationImage',
                values.roleVerificationImage
              );
              dispatch(registerUser(formData)).then((res) => {
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
                component: PersonalData,
                validationSchema: Yup.object().shape({
                  name: Yup.string().required('Name is required'),
                  email: Yup.string()
                    .email('Please enter valid email')
                    .required('Email is required'),
                  role: Yup.string().required('Please select you are role.'),
                  roleNumber: Yup.string().test({
                    test: function(value) {
                      const role = this.resolve(Yup.ref('role'));

                      if (role === 'Student') {
                        return value && value.trim() !== '';
                      }

                      return true; 
                    },
                    message: 'Please enter your University Role number.',
                  }),
                  password: Yup.string()
                    .required('Password is required')
                    .matches(
                      /^.*(?=.{8,})((?=.*[!@#$%^&*()\-_=+{};:,<.>]){1})(?=.*\d)((?=.*[a-z]){1})((?=.*[A-Z]){1}).*$/,
                      'Password must contain at least 8 characters, one uppercase, one number and one special case character'
                    ),
                  university: Yup.string().required(
                    'Please select your University Name.'
                  ),
                }),
              },
              {
                component: Other,
                validationSchema: Yup.object().shape({
                  bio: Yup.string().required('Please add a bio.'),
                  roleVerificationImage: Yup.string().required(
                    'Please add a image to verify your role, e.g. (Id Card)'
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
                        <StepLabel>Personal Details</StepLabel>
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
