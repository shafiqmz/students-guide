import React, { useState } from 'react';
import { Field, useFormikContext } from 'formik';
import Avatar from '@mui/material/Avatar';
import { IconButton, InputAdornment, MenuItem, TextField } from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useSelector } from 'react-redux';

const PersonalData = ({ errors, values, handleChange }) => {
  const { setFieldValue } = useFormikContext();
  const [previewImage, setPreviewImage] = useState(null);
  const [showPassword, setShowPassword] = React.useState(false);

  const approvedUniversities = useSelector((state) => state.university.approvedUniversities);
  const handleClickShowPassword = () => setShowPassword((show) => !show);


  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageDataURL = e.target.result;
        setFieldValue('profilePicture', selectedImage);
        setPreviewImage(imageDataURL);
      };
      reader.readAsDataURL(selectedImage);
    }
  };

  return (
    <div className='flex flex-col'>
      <div className='flex justify-center'>
        <input
          type='file'
          name='profilePicture'
          onChange={handleImageChange}
          accept='.jpeg, .jpg, .png'
          style={{
            display: 'none',
          }}
          id='profilePictureInput'
        />
        <label htmlFor='profilePictureInput'>
          <Avatar
            alt='Profile Picture'
            src={previewImage}
            className='avatar-profile-pic'
          />
        </label>
      </div>
      <div className='flex items-center mt-6'>
        <TextField
          error={!!errors.name}
          name='name'
          label='Enter your full name'
          required
          value={values.name}
          helperText={errors.name}
          onChange={handleChange}
          className='w-2/5 mr-4'
        />

        <TextField
          error={!!errors.email}
          name='email'
          label='Email'
          value={values.email}
          required
          helperText={errors.email}
          onChange={handleChange}
          className='w-3/5'
        />
      </div>

      <div className='flex items-center mt-4'>
        <TextField
          id='outlined-adornment-password'
          type={showPassword ? 'text' : 'password'}
          error={!!errors.password}
          name='password'
          label='Password'
          value={values.password}
          required
          helperText={errors.password}
          onChange={handleChange}
          className='w-3/6 mr-4'
          InputProps={{
            endAdornment: (
              <InputAdornment position='end'>
                <IconButton
                  aria-label='toggle password visibility'
                  onClick={handleClickShowPassword}
                  edge='end'
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />

        <TextField
          select
          error={!!errors.role}
          required
          name='role'
          label='Role'
          value={values.role}
          helperText={errors.role}
          onChange={handleChange}
          className='w-3/6'
        >
          {[
            { label: 'Student', value: 'Student' },
            { label: 'Teacher', value: 'Teacher' },
          ].map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      </div>

      {
        values?.role === "Student" && (
          <TextField
            error={!!errors.roleNumber}
            name='roleNumber'
            label='Role Number'
            value={values.roleNumber}
            required
            helperText={errors.roleNumber}
            onChange={handleChange}
            className='mt-4'
            fullWidth
          />
        )
      }
      <TextField
        fullWidth
        select
        error={!!errors.university}
        name='university'
        label='Enter University'
        required
        value={values.university}
        helperText={errors.university}
        onChange={handleChange}
        className='mt-4'
      >
        {approvedUniversities?.map((option) => (
          <MenuItem key={option.id} value={option.id}>
            {option.universityName}
          </MenuItem>
        ))}
      </TextField>
    </div>
  );
};

export default PersonalData;
