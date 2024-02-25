import React, { useState } from 'react';
import { useFormikContext } from 'formik';
import { Chip, TextField, IconButton } from '@mui/material';
import ClearIcon from '@mui/icons-material/HighlightOffRounded';

const Other = ({ errors, values, handleChange }) => {
  const { setFieldValue } = useFormikContext();
  const [selectedFile, setSelectedFile] = useState(null);
  const [interest, setInterest] = useState(''); 
  const [interestsArray, setInterestsArray] = useState([]);
  const [skill, setSkill] = useState(''); 
  const [skillsArray, setSkillsArray] = useState([]);

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];

    if (selectedImage) {
      setFieldValue('roleVerificationImage', selectedImage);
      setSelectedFile(selectedImage);
    }
  };

  const addItem = (type) => {
    if (type === 'interest') {
      if (interest.trim() !== '') {
        const updatedArr = [...interestsArray, interest.trim()];
        setInterestsArray(updatedArr);
        setFieldValue('interests', updatedArr);
        setInterest('');
      }
    } else if (type === 'skill') {
      if (skill.trim() !== '') {
        const updatedArr = [...skillsArray, skill.trim()];
        setSkillsArray(updatedArr);
        setFieldValue('skills', updatedArr);
        setSkill('');
      }
    }
  };

  const openFileInput = () => {
    const fileInput = document.getElementById('roleVerificationInput');
    fileInput.click();
  };

  const removeItem = (itemToRemove, type) => {
    if (type === 'interest') {
      setInterestsArray(interestsArray.filter((interest) => interest !== itemToRemove));
    } else if (type === 'skill') {
      setSkillsArray(skillsArray.filter((skill) => skill !== itemToRemove));
    }
  };

  return (
    <div className='flex flex-col'>
      {values.role === 'Student' && (
        <div className='flex items-center mt-4'>
          <TextField
            fullWidth
            type='date'
            name='graduation'
            label='Enter your graduation date'
            focused
            value={values.graduation}
            onChange={handleChange}
          />
        </div>
      )}
      {values.role === 'Student' && (
        <div className='flex flex-col mt-4'>
          <TextField
            fullWidth
            name='interests'
            label='Enter your interests'
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem("interest");
              }
            }}
          />
          <div className="flex mt-2 flex-wrap gap-3">
          {interestsArray.map((interest, index) => (
            <Chip
              key={index}
              label={interest}
              onDelete={() => removeItem(interest, "interest")}
              className='bg-primaryBlue text-white mr-1'
              deleteIcon={
                  <ClearIcon style={{color: 'white'}} />
              }
            />
          ))}
          </div>
        </div>
      )}
      {values.role === 'Student' && (
        <div className='flex flex-col mt-4'>
          <TextField
            fullWidth
            name='skills'
            label='Enter your skills'
            value={skill}
            onChange={(e) => setSkill(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addItem("skill");
              }
            }}
          />
          <div className="flex mt-2 flex-wrap gap-3">
          {skillsArray.map((skill, index) => (
            <Chip
              key={index}
              label={skill}
              onDelete={() => removeItem(skill, "skill")}
              className='bg-primaryBlue text-white mr-1'
              deleteIcon={
                  <ClearIcon style={{color: 'white'}} />
              }
            />
          ))}
          </div>
        </div>
      )}
      <div className='flex items-center mt-4'>
        <TextField
          fullWidth
          error={!!errors.bio}
          name='bio'
          label='Add your bio'
          required
          value={values.bio}
          helperText={errors.bio}
          onChange={handleChange}
          multiline
          rows={4}
        />
      </div>
      <div className='mt-2 flex flex-col'>
        <input
          type='file'
          name='roleVerificationImage'
          onChange={handleImageChange}
          accept='.jpeg, .jpg, .png'
          style={{
            display: 'none',
          }}
          id='roleVerificationInput'
        />
        <label htmlFor='roleVerificationInput'>
          <button
            onClick={openFileInput}
            className='px-6 mx-auto bg-lightBlue transition-all hover:bg-lightOrange hover:text-secondaryOrange text-blue-600 rounded-md h-12 text-lg mt-5'
          >
            Verify your role
          </button>
          {selectedFile && (
            <span className='mt-2 xs:ml-2'>{selectedFile.name}</span>
          )}
        </label>
        {errors.roleVerificationImage && (
          <label
            htmlFor='roleVerificationInput'
            className='text-sm font-light text-red-600 mt-2'
          >
            Verify your role by uploading any valid image of your University Id.
          </label>
        )}
      </div>
    </div>
  );
};

export default Other;
