import React, { useEffect, useState } from 'react';
import { useFormikContext } from 'formik';
import { MenuItem, Slider, TextField } from '@mui/material';

const JobInfo = ({ errors, values, handleChange }) => {

    const { setFieldValue } = useFormikContext();
    const minDistance = 5;

    const jobType = [
        { label: 'Internship', value: 'Internship' },
        { label: 'Part-Time', value: 'Part-Time' },
        { label: 'Full-Time', value: 'Full-Time' },
    ];

    const jobMode = [
        { label: 'Remote', value: 'Remote' },
        { label: 'Hybrid', value: 'Hybrid' },
        { label: 'On-site', value: 'On-site' },
    ];

    function valuetext(value) {
        return `${value} employees`;
    }


    const handleChangeSlider = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        if (activeThumb === 0) {
            setFieldValue("range", ([Math.min(newValue[0], values.range[1] - minDistance), values.range[1]]));
        } else {
            setFieldValue("range", ([values.range[0], Math.max(newValue[1], values.range[0] + minDistance)]));
        }
    };

    return (
        <div className='flex flex-col'>
            <TextField
                error={!!errors.jobTitle}
                name='jobTitle'
                label='Enter Job Title'
                required
                value={values.jobTitle}
                helperText={errors.jobTitle}
                onChange={handleChange}
                className='mt-4'
                fullWidth
            />
            <TextField
                error={!!errors.companyName}
                name='companyName'
                label='Enter Company Name'
                required
                value={values.companyName}
                helperText={errors.companyName}
                onChange={handleChange}
                className='mt-4'
                fullWidth
            />
            <TextField
                error={!!errors.location}
                name='location'
                label='Enter Job Location'
                required
                value={values.location}
                helperText={errors.location}
                onChange={handleChange}
                className='mt-4'
                fullWidth
            />
            <TextField
                select
                error={!!errors.type}
                required
                name='type'
                label='type'
                value={values.type}
                helperText={errors.type}
                onChange={handleChange}
                className='mt-4'
            >
                {jobType.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            <TextField
                select
                error={!!errors.mode}
                required
                name='mode'
                label='mode'
                value={values.mode}
                helperText={errors.mode}
                onChange={handleChange}
                className='mt-4'
            >
                {jobMode.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                        {option.label}
                    </MenuItem>
                ))}
            </TextField>

            <label htmlFor="range">Company Size:</label>
            <Slider
                name="range"
                min={1}
                max={1000}
                value={values.range}
                onChange={handleChangeSlider}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                disableSwap
            />

            <TextField
                error={!!errors.contactEmail}
                name='contactEmail'
                label='Enter Company Email'
                required
                value={values.contactEmail}
                helperText={errors.contactEmail}
                onChange={handleChange}
                className='mt-4'
                fullWidth
            />
        </div>
    );
};

export default JobInfo;
