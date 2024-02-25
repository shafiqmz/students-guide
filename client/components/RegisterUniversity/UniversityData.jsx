import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { MenuItem, TextField } from '@mui/material';
import { GrFormClose } from '@react-icons/all-files/gr/GrFormClose';
import { AttachmentViewer } from '../General/AttachmentViewer';

const UniversityData = ({ errors, values, handleChange }) => {
  const { setFieldValue } = useFormikContext();
  const [selectedImages, setSelectedImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [showImage, setShowImage] = useState(false);

  const removeImage = (index) => {
    const updatedImages = [...selectedImages];
    updatedImages.splice(index, 1);
    setSelectedImages(updatedImages);
    setFieldValue('universityImages', updatedImages);
  };

  useEffect(() => {
    if (selectedImages) {
      const imageArray = [];
      const imagePreviews = [];

      if (selectedImages.length === 0) {
        setPreviewImages([]);
      }

      for (let i = 0; i < selectedImages.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataURL = e.target.result;

          imageArray.push(imageDataURL);
          imagePreviews.push(
            <div className='relative'>
              <img
                onClick={() => setShowImage(true)}
                key={i}
                src={imageDataURL}
                alt={`University Image ${i + 1}`}
                className='w-24 h-24 object-cover m-2 rounded-lg'
              />
              <div
                onClick={() => removeImage(i)}
                className='absolute top-[2px] right-0 text-xl bg-primaryBlue cursor-pointer rounded-full'
              >
                <GrFormClose />
              </div>
            </div>
          );
          if (imageArray.length === selectedImages.length) {
            setPreviewImages(imagePreviews);
          }
        };

        reader.readAsDataURL(selectedImages[i]);
      }
    }
  }, [selectedImages]);

  const handleImageChange = (event) => {
    setSelectedImages(event.target.files);
    setFieldValue('universityImages', event.target.files);

    if (selectedImages && selectedImages.length > 0) {
      const imageArray = [];
      const imagePreviews = [];

      for (let i = 0; i < selectedImages.length; i++) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const imageDataURL = e.target.result;

          imageArray.push(imageDataURL);
          imagePreviews.push(
            <div className='relative'>
              <img
                key={i}
                src={imageDataURL}
                alt={`University Image ${i + 1}`}
                className='w-24 h-24 object-cover m-2 rounded-lg'
              />
              <div
                onClick={() => removeImage(i)}
                className='absolute top-[2px] right-0 text-xl bg-primaryBlue cursor-pointer rounded-full'
              >
                <GrFormClose />
              </div>
            </div>
          );
          if (imageArray.length === selectedImages.length) {
            setPreviewImages(imagePreviews);
          }
        };

        reader.readAsDataURL(selectedImages[i]);
      }
    }
  };

  const openFileInput = () => {
    const fileInput = document.getElementById('universityImagesInput');
    fileInput.click();
  };

  const provinces = [
    { label: 'Punjab', value: 'Punjab' },
    { label: 'Sindh', value: 'Sindh' },
    { label: 'KPK', value: 'KPK' },
    { label: 'Balochistan', value: 'Balochistan' },
    { label: 'Azad Kashmir', value: 'Kashmir' },
    { label: 'Gitgit Baltistan', value: 'GitgitBaltistan' },
  ];

  return (
    <>
      <div className='flex flex-col'>
        <div className='flex items-center mt-6'>
          <TextField
            error={!!errors.name}
            name='name'
            label='Enter univeristy full name'
            required
            value={values.name}
            helperText={errors.name}
            onChange={handleChange}
            className='w-3/5 mr-4'
          />
          <TextField
            error={!!errors.domainEmail}
            name='domainEmail'
            label='Enter domain email'
            required
            value={values.domainEmail}
            helperText={errors.domainEmail}
            onChange={handleChange}
            className='w-2/5'
          />
        </div>
        <TextField
          error={!!errors.websiteUrl}
          name='websiteUrl'
          label='Enter University website'
          required
          value={values.websiteUrl}
          helperText={errors.websiteUrl}
          onChange={handleChange}
          className='mt-4'
          fullWidth
        />
        <TextField
          select
          error={!!errors.province}
          required
          name='province'
          label='province'
          value={values.province}
          helperText={errors.province}
          onChange={handleChange}
          className='mt-4'
        >
          {provinces.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
        <div className='mt-2 flex flex-col'>
          <input
            type='file'
            name='universityImages'
            onChange={handleImageChange}
            accept='.jpeg, .jpg, .png'
            multiple
            style={{
              display: 'none',
            }}
            id='universityImagesInput'
          />
          <label htmlFor='universityImagesInput'>
            <button
              onClick={openFileInput}
              className='a-6 mx-auto bg-lightBlue transition-all hover:bg-lightOrange hover:text-secondaryOrange text-blue-600 rounded-md h-12 text-lg mt-3 w-full'
            >
              Upload University Images
            </button>
          </label>
          {errors.universityImages && (
            <label
              htmlFor='roleVerificationInput'
              className='text-sm font-light text-red-600 mt-2'
            >
              Upload images of the university
            </label>
          )}
        </div>
        <div className='flex flex-wrap'>{previewImages}</div>

        {/* <div className='flex justify-center'>
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
        {universities.map((option) => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField> */}
      </div>
      {showImage && (
        <AttachmentViewer
          onClose={() => setShowImage(false)}
          attachmentObject={selectedImages}
        />
      )}
    </>
  );
};

export default UniversityData;
