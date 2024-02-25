import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { TextField } from '@mui/material';

const Other = ({ errors, values, handleChange }) => {
  const { setFieldValue } = useFormikContext();
  const [selectedFile, setSelectedFile] = useState(null);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setSelectedFile(selectedImage);

    if (selectedImage) {
        setFieldValue('hecLicenseImage', selectedImage);
    }
  };

  const openFileInput = () => {
    const fileInput = document.getElementById('hecLicenseImage');
    fileInput.click();
  };

  return (
    <div className='flex flex-col'>
        <TextField
          fullWidth
          error={!!errors.representativeName}
          name='representativeName'
          label='Enter admin name'
          required
          value={values.representativeName}
          helperText={errors.representativeName}
          onChange={handleChange}
          className='mt-6'
        />
        <TextField
          fullWidth
          error={!!errors.representativeEmail}
          name='representativeEmail'
          label='Enter admin email'
          required
          value={values.representativeEmail}
          helperText={errors.representativeEmail}
          onChange={handleChange}
          className='mt-6'
        />
      <div className='mt-2 flex flex-col'>
        <input
          type='file'
          name='hecLicenseImage'
          onChange={handleImageChange}
          accept='.jpeg, .jpg, .png'
          style={{
            display: 'none',
          }}
          id='hecLicenseImage'
        />
        <label htmlFor='hecLicenseImage'>
          <button
            onClick={openFileInput}
            className='px-6 mx-auto bg-lightBlue transition-all hover:bg-lightOrange hover:text-secondaryOrange text-blue-600 rounded-md h-12 text-lg mt-5'
          >
            Upload HEC License
          </button>
          {selectedFile && <span className='mt-2 xs:ml-2'>{selectedFile.name}</span>}
        </label>
        {errors.hecLicenseImage && (
          <label
            htmlFor='hecLicenseImage'
            className='text-sm font-light text-red-600 mt-2'
          >
            Verify your University by uploading HEC License Image.
          </label>
        )}
      </div>
    </div>
  );
};

export default Other;
