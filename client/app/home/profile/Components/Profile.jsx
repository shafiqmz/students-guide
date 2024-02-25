import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import { Chip, MenuItem, TextareaAutosize, TextField } from '@mui/material';
import useGetRole from '@/components/General/CustomHooks/useGetRole';
import ShowPost from '@/components/Post/ShowPost';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { setLoggedInUserInfo } from '@/redux/features/User/userSlice';
import { useSnackbar } from "notistack"
import WritePost from '@/components/Post/WritePost';

const Profile = ({ mine, user }) => {
    const [previewImage, setPreviewImage] = useState(user?.profilePicture);
    const token = JSON.parse(localStorage.getItem("token"));
    const role = useGetRole();
    const [name, setName] = useState(user?.name);
    const [bio, setBio] = useState(user?.bio);
    const email = user?.email;
    const university = user?.universityName;
    const [userRole, setUserRole] = useState(user?.role);
    const roleNumber = user?.roleNumber;
    const [interest, setInterest] = useState('');
    const [interestsArray, setInterestsArray] = useState(user?.interests);
    const [skill, setSkill] = useState('');
    const [skillsArray, setSkillsArray] = useState(user?.skills);
    const dispatch = useDispatch();
    const [typingTimeout, setTypingTimeout] = useState(null);
    const { enqueueSnackbar } = useSnackbar();

    const updateUserData = (payload) => {
        const apiUrl = `${process.env.API_URL}user/profile/${user?._id}`;
        axios.put(apiUrl, payload, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then((res) => {
                if (mine) {
                    dispatch(setLoggedInUserInfo(res?.data))
                }
                enqueueSnackbar("Successfully updated user.", { variant: "success" })
            })
            .catch((error) => {
                enqueueSnackbar("Something wend wrong while updating user.", { variant: "error" })
            });
    }

    const addItem = (type) => {
        if (type === 'interest') {
            if (interest.trim() !== '') {
                const updatedArr = [...interestsArray, interest.trim()];
                setInterestsArray(updatedArr);
                setInterest('');
                updateUserData({ interests: updatedArr });
            }
        } else if (type === 'skill') {
            if (skill.trim() !== '') {
                const updatedArr = [...skillsArray, skill.trim()];
                setSkillsArray(updatedArr);
                setSkill('');
                updateUserData({ skills: updatedArr });
            }
        }
    };

    const removeItem = (itemToRemove, type) => {
        if (type === 'interest') {
            const filteredInterests = interestsArray.filter((interest) => interest !== itemToRemove)
            setInterestsArray(filteredInterests);
            updateUserData({ interests: filteredInterests })
        } else if (type === 'skill') {
            const filteredSkills = skillsArray.filter((skill) => skill !== itemToRemove)
            setSkillsArray(filteredSkills);
            updateUserData({ skills: filteredSkills })
        }
    };

    const handleImageChange = (event) => {
        const selectedImage = event.target.files[0];

        if (selectedImage) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const imageDataURL = e.target.result;
                setPreviewImage(imageDataURL);
                const formData = new FormData();
                formData.append("profilePicture", selectedImage)
                updateUserData(formData)
            };
            reader.readAsDataURL(selectedImage);
        }
    };

    const handleNameChange = (e) => {
        setName(e.target.value);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const newTypingTimeout = setTimeout(() => {
            if (name !== "") {
                updateUserData({ name: e.target.value });
            }
        }, 1000);

        setTypingTimeout(newTypingTimeout);
    }

    const handleBioChange = (e) => {
        setBio(e.target.value);

        if (typingTimeout) {
            clearTimeout(typingTimeout);
        }

        const newTypingTimeout = setTimeout(() => {
            if (bio !== "") {
                updateUserData({ bio: e.target.value });
            }
        }, 2000);

        setTypingTimeout(newTypingTimeout);
    }


    return (
        <div className='flex flex-col items-center h-screen overflow-y-auto pt-8 pb-20'>
            <div className='w-11/12 xs:w-10/12 md:w-3/4 flex flex-col bg-white shadow-lg rounded-lg p-3 md:p-4 lg:p-6 mt-3'>
                <div className='flex justify-center flex-col items-center'>
                    {mine ? (
                        <>
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
                                    className='hover:opacity-50 cursor-pointer w-40 h-40 shadow-lg '
                                />
                            </label>
                        </>
                    ) : (
                        <Avatar
                            alt='Profile Picture'
                            src={previewImage}
                            className='w-52 h-52 shadow-lg'
                        />
                    )}
                    <TextareaAutosize
                        disabled={!mine}
                        className="w-4/5 xs:w=3/4 sm:2/4 text-xs sm:text-sm md:text-md lg:text-lg text-center border-none outline-none resize-none mt-5 bg-transparent"
                        value={bio}
                        autoS
                        onChange={handleBioChange}
                    />

                    <div className="w-full flex flex-col">
                        <div className='flex flex-col sm:flex-row sm:items-center mt-8'>
                            <TextField
                                name='name'
                                label='Full name'
                                required
                                value={name}
                                onChange={handleNameChange}
                                className='w-full sm:w-2/5 mr-4'
                                disabled={!mine}
                            />

                            <TextField
                                name='email'
                                label='Email'
                                value={email}
                                required
                                className='w-full sm:w-3/5 mt-4 sm:mt-0'
                                disabled
                            />
                        </div>
                        {(role === "Student") &&
                            <TextField
                                name='roleNumber'
                                label='roleNumber'
                                value={roleNumber}
                                required
                                className='w-full mt-4'
                                disabled
                            />}
                        {(role !== "Superadmin") &&
                            <TextField
                                name='university'
                                label='University'
                                value={university}
                                required
                                className='w-full mt-4'
                                disabled
                            />
                        }
                        {(mine || role === "Admin" || role === "Superadmin") &&
                            <TextField
                                select
                                required
                                name='role'
                                label='Role'
                                value={userRole}
                                onChange={(e) => {
                                    setUserRole(e.target.value)
                                    updateUserData({ role: e.target.value })
                                }}
                                className="w-full mt-4"
                                disabled={!(role === "Admin")}
                            >
                                {role !== 'Superadmin' ? (
                                    [
                                        { label: 'Student', value: 'Student' },
                                        { label: 'Teacher', value: 'Teacher' },
                                        { label: 'Admin', value: 'Admin' },
                                    ].map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))
                                ) : role === 'Superadmin' ? (
                                    [
                                        { label: 'Student', value: 'Student' },
                                        { label: 'Teacher', value: 'Teacher' },
                                        { label: 'Admin', value: 'Admin' },
                                        { label: 'Superadmin', value: 'Superadmin' },
                                    ].map((option) => (
                                        <MenuItem key={option.value} value={option.value}>
                                            {option.label}
                                        </MenuItem>
                                    ))
                                ) : null}
                            </TextField>
                        }
                        {(userRole === "Student") &&
                            <>
                                <div className='flex flex-col mt-4'>
                                    <TextField
                                        name='interests'
                                        label='Interest'
                                        value={interest}
                                        onChange={(e) => setInterest(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addItem('interest');
                                            }
                                        }}
                                        fullWidth
                                        disabled={!mine}
                                    />
                                    <div className='flex flex-wrap mt-2'>
                                        {interestsArray?.map((interest, index) => (
                                            <Chip
                                                key={index}
                                                label={interest}
                                                onDelete={mine ? () => removeItem(interest, 'interest') : undefined}
                                                className={`${mine ? "bg-primaryBlue" : "bg-lightOrange"} text-white mr-1 mt-2`}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className='flex flex-col mt-4'>
                                    <TextField
                                        name='skills'
                                        label='Skill'
                                        value={skill}
                                        onChange={(e) => setSkill(e.target.value)}
                                        onKeyPress={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addItem('skill');
                                            }
                                        }}
                                        fullWidth
                                        disabled={!mine}
                                    />
                                    <div className='flex flex-wrap mt-2'>
                                        {skillsArray?.map((skill, index) => (
                                            <Chip
                                                key={index}
                                                label={skill}
                                                onDelete={mine ? () => removeItem(skill, 'skill') : undefined}
                                                className={`${mine ? "bg-primaryBlue" : "bg-lightOrange"} text-white mr-1 mt-2`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
            {
                role !== "Superadmin" &&  
                (<div className="w-11/12 xs:w-10/12 md:w-3/4">
                <h3 className='my-7 pb-4 border-b-2 border-primaryBlue text-primaryBlue font-semibold text-2xl'>{mine ? "My Posts" : "Posts"}</h3>
                {
                    mine && <WritePost />
                }
                <ShowPost profile={true} userId={user?._id} />
            </div>
                )
            }
        </div>
    );
};

export default Profile;
