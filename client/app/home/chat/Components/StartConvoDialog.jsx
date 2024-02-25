import React, { useEffect, useState } from 'react';
import {
    Button,
    Box,
    Dialog,
    DialogContent,
    DialogTitle,
    TextField,
    DialogActions,
} from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import { useSnackbar } from 'notistack';
import SmallSpinnerLoader from '@/components/General/SmallSpinnerLoader';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

export const StartConvoDialog = ({ open, onClose }) => {
    const [userListLoading, setUserListLoading] = useState(false);
    const userInfo = useSelector(state => state.user.userInfo)
    const [startLoading, setStartLoading] = useState(false);
    const [userList, setUserList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const token = JSON.parse(localStorage.getItem('token'));
    const { enqueueSnackbar } = useSnackbar();
    const { push } = useRouter();

    useEffect(() => {
        fetchUserList();
    }, []);

    const fetchUserList = () => {
        setUserListLoading(true);
        axios
            .get(`${process.env.API_URL}chat/user-list`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const formattedUserList = res?.data?.map((user) => ({
                    label: `${user.name} (${user.email})`,
                    value: user._id,
                }));
                setUserList(formattedUserList);
            })
            .catch((error) => {
                console.error(error);
                setUserListLoading(false);
            });
    };

    const handleStartConversation = () => {
        if (selectedUser) {
            setUserListLoading(true)
            const payload = {
                participants: [userInfo?._id, selectedUser]
            }

            axios.post(`${process.env.API_URL}chat/create`, payload, { headers: { Authorization: `Bearer ${token}` } })
                .then(res => {
                    push(`/home/chat/${res?.data?._id}`)
                    onClose();
                })
                .catch(error => {
                    if (error.response.status === 400) {
                        enqueueSnackbar("Conversation already exists.", { variant: "error" })
                    } else {
                        enqueueSnackbar("Internal server error.", { variant: "error" })
                    }
                })
                .finally(() => {
                    setUserListLoading(false)
                })
        } else {
            enqueueSnackbar('Please select a user', { variant: 'info' });
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            classes={{ paper: 'custom-dialog' }}
            maxWidth="sm"
            fullWidth
        >
            <DialogTitle className="text-textColor">Start conversation</DialogTitle>
            <DialogContent>
                <Autocomplete
                loading={userListLoading}
                    options={userList}
                    getOptionLabel={(option) => option.label}
                    onChange={(event, selected) => setSelectedUser(selected?.value || null)}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label="Select a user"
                            variant="outlined"
                            fullWidth
                        />
                    )}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    className="bg-primaryBlue text-white px-2 hover:bg-lightBlue transition duration-100"
                    onClick={handleStartConversation}
                    disabled={startLoading}
                >
                    {startLoading && <SmallSpinnerLoader />}
                    <span className={`${startLoading && 'ml-2'}`}>Start Conversation</span>
                </Button>
            </DialogActions>
        </Dialog>
    );
};
