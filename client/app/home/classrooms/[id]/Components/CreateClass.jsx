import { Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import React, { useState } from 'react'
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useSelector } from "react-redux"
import { useSnackbar } from "notistack"
import * as Yup from 'yup';
import axios from "axios"

const validationSchema = Yup.object().shape({
    classTitle: Yup.string().min(6, 'Must be 6 letters long').required('Class Title is required'),
    classDescription: Yup.string().required('Class Description is required'),
    classCode: Yup.string().min(4, 'Must be 4 characters long').required('Class Description is required'),
});

const CreateClass = ({ open, onClose, fetchClassrooms }) => {

    const [isSubmitting, setIsSubmitting] = useState(false);
    const userInfo = useSelector(state => state.user.userInfo);
    const token = JSON.parse(localStorage.getItem("token"))
    const { enqueueSnackbar } = useSnackbar();

    const handleCreateClassroom = (values, { setSubmitting }) => {
        setIsSubmitting(true);
        const payload = {
            title: values.classTitle,
            description: values.classDescription,
            classCode: values.classCode,
            teacherId: userInfo._id,
            universityId: userInfo.university
        }

        axios.post(`${process.env.API_URL}classroom/create`, payload, {headers: {Authorization: `Bearer ${token}`}})
        .then((res) => {
            if (res.status === 201) {
                setIsSubmitting(false)
                onClose();
                enqueueSnackbar("Successfully created classroom.", {variant: "success"});
                fetchClassrooms();
            } else {
                enqueueSnackbar("Something went wrong while creating class.", {variant: "error"});
                setIsSubmitting(false);
            }
        }).catch((err) => {
            enqueueSnackbar("Something went wrong while creating class.", {variant: "error"});
            setIsSubmitting(false);
        })
    }

    return (
        <Dialog open={open} onClose={onClose} classes={{ paper: 'custom-dialog' }}>
            <DialogTitle className='text-textColor'>Create Class</DialogTitle>
            <DialogContent>
                <Formik
                    initialValues={{ classTitle: "", classDescription: "", classCode: "" }}
                    validationSchema={validationSchema}
                    onSubmit={handleCreateClassroom}
                >
                    {({ errors, values, handleChange, handleBlur }) => (
                        <Form>
                            <TextField
                                error={!!errors.classTitle}
                                name='classTitle'
                                label='Enter Class Title'
                                required
                                value={values.classTitle}
                                helperText={errors.classTitle}
                                onChange={handleChange}
                                className='mt-4'
                                fullWidth
                            />
                            <textarea
                                className={`${errors.classDescription && 'border-[#d32f2f]'} border rounded p-2 outline-none resize-none w-full mt-4`}
                                rows={5}
                                placeholder='Enter Class description'
                                name='classDescription'
                                value={values.classDescription}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                autoFocus
                            />
                            <ErrorMessage name="classDescription" component="div" className="text-[#d32f2f] text-[0.75rem] ml-[14px] mt-[3px]" />
                            <TextField
                                error={!!errors.classCode}
                                name='classCode'
                                label='Class Code'
                                required
                                value={values.classCode}
                                helperText={errors.classCode}
                                onChange={handleChange}
                                className='mt-4'
                                fullWidth
                            />
                            <DialogActions>
                                <Button onClick={onClose}>Cancel</Button>
                                <Button type="submit" className='bg-primaryBlue text-white hover:bg-lightBlue' disabled={isSubmitting}>
                                    Create
                                </Button>
                            </DialogActions>
                        </Form>)}
                </Formik>
            </DialogContent>
        </Dialog>
    )
}

export default CreateClass