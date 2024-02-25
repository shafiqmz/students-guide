'use client';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';
import { Avatar, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import BootstrapTable from 'react-bootstrap-table-next';
import PageLoader from '@/components/General/PageLoader';
import NoDataLottie from '@/components/General/NoDataLottie';
import UserDrawer from '@/components/General/UserDrawer';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import { getApprovedUniversities } from '@/redux/features/University/universityActions';
import { useDispatch, useSelector } from 'react-redux';

const UserList = ({ userRole }) => {
    const PAGESIZE = 10;
    const [page, setPage] = useState(1);
    const [userData, setUserData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [approved, setApproved] =
        useState('all');
    const [role, setRole] = useState('all');
    const [university, setUniversity] = useState('all');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerData, setDrawerData] = useState({})
    const token = JSON.parse(localStorage.getItem('token'));
    const { enqueueSnackbar } = useSnackbar();
    const [totalPages, setTotalPages] = useState(1);
    const [searchString, setSearchString] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);
    const dispatch = useDispatch();
    const approvedUniversities = useSelector((state) => state.university.approvedUniversities)

    useEffect(() => {
        dispatch(getApprovedUniversities());
    }, []);

    const handleDeleteUser = (id) => {
        const apiUrl = `${process.env.API_URL}user/${id}`;
        axios
            .delete(
                apiUrl,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            .then((res) => {
                enqueueSnackbar('Successfully deleted user.', {
                    variant: 'success',
                });
                fetchUsersList();
            })
            .catch((error) => {
                enqueueSnackbar('Something went wrong while deleting user.', {
                    variant: 'error',
                });
            });
    }

    const columns = [
        {
            dataField: 'profilePicture',
            text: 'Avatar',
            formatter: (cell, row) => {
                return (
                    <Avatar
                        className='w-8 h-8 mx-auto'
                        src={row?.profilePicture}
                        alt={row?.name}
                    />
                );
            },
            headerStyle: { width: '80px', textAlign: 'center' },
            style: { width: '80px' },
        },
        {
            dataField: 'name',
            text: 'Name',
            headerStyle: { width: '150px', textAlign: 'center' },
            style: { width: '150px' },
            formatter: (cell, row) => {
                return (
                    <div>{`${row?.name} (${row?.role === "Student" ? row?.roleNumber : row?.role})`}</div>
                );
            },
        },
        {
            dataField: 'email',
            text: 'Email',
            headerStyle: { width: '250px', textAlign: 'center' },
            style: { width: '250px' },
        },
        {
            dataField: 'role',
            text: 'Role',
            headerStyle: { width: '150px', textAlign: 'center' },
            style: { width: '150px' },
        },
        {
            dataField: 'isVerified',
            text: 'Approval Status',
            formatter: (cell, row) => {
                return (
                    <div
                        className={`${row?.isVerified ? 'bg-green-300' : 'bg-red-300'
                            } text-white p-2 text-center`}
                    >
                        {row?.isVerified ? 'Yes' : 'No'}
                    </div>
                );
            },
            headerStyle: { width: '150px', textAlign: 'center' },
            style: { width: '150px' },
        },
    ];

    if (userRole === "Superadmin") {
        columns.push({
            dataField: 'university.name',
            text: 'University',
            headerStyle: { width: '250px', textAlign: 'center' },
            style: { width: '250px' },
        })
        columns.push({
            dataField: 'action',
            text: '',
            headerStyle: { width: '75px' },
            style: { width: '75px' },
            formatter: (cell, row) => {
                return (
                    <button
                        onClick={() => {
                            setDrawerData(row);
                            setOpenDrawer(true);
                        }}
                        className='bg-primaryBlue text-white px-3 py-1 rounded-md w-100 hover:bg-lightBlue hover:text-black transition-colors'
                    >
                        Edit
                    </button>
                );
            },
        })
        columns.push(
            {
                dataField: 'action',
                text: '',
                headerStyle: { width: '100px' },
                style: { width: '100px' },
                formatter: (cell, row) => {
                    return (
                        <button
                            onClick={() => {
                                handleDeleteUser(row?._id)
                            }}
                            className='bg-red-600 text-white px-3 py-1 rounded-md w-100 hover:bg-red-400 transition-colors'
                        >
                            Delete
                        </button>
                    );
                },
            })
    } else {
        columns.push({
            dataField: 'action',
            text: '',
            headerStyle: { width: '75px' },
            style: { width: '75px' },
            formatter: (cell, row) => {
                return (
                    <button
                        onClick={() => {
                            setDrawerData(row);
                            setOpenDrawer(true);
                        }}
                        className='bg-primaryBlue text-white px-3 py-1 rounded-md w-100 hover:bg-lightBlue hover:text-black transition-colors'
                    >
                        Edit
                    </button>
                );
            },
        })
        columns.push(
            {
                dataField: 'action',
                text: '',
                headerStyle: { width: '100px' },
                style: { width: '100px' },
                formatter: (cell, row) => {
                    return (
                        <button
                            onClick={() => {
                                handleDeleteUser(row?._id)
                            }}
                            className='bg-red-600 text-white px-3 py-1 rounded-md w-100 hover:bg-red-400 transition-colors'
                        >
                            Delete
                        </button>
                    );
                },
            })
    }

    const verificationOptions = [
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Verified',
            value: true,
        },
        {
            label: 'Not Verified',
            value: false,
        },
    ];

    const roleOptions = [
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Student',
            value: 'Student',
        },
        {
            label: 'Teacher',
            value: 'Teacher',
        },
        {
            label: 'Admin',
            value: 'Admin',
        },
    ];

    if (userRole === "Superadmin") {
        roleOptions.push({
            label: 'Superadmin',
            value: 'Superadmin'
        })
    }

    useEffect(() => {
        fetchUsersList();
    }, [page, role, approved, university]);

    const fetchUsersList = (searchString = '') => {
        setLoading(true);

        const apiUrl = `${process.env.API_URL}user/all`;

        const queryParams = {
            pageSize: PAGESIZE,
            page: page,
        };

        if (role && role !== 'all') {
            queryParams.role = role;
        }

        if (approved !== 'all') {
            queryParams.isVerified = approved;
        }

        if (university !== 'all') {
            queryParams.university = university;
        }

        queryParams.email = searchString;

        const queryString = new URLSearchParams(queryParams).toString();

        const filteredApiUrl = `${apiUrl}?${queryString}`; axios
            .get(filteredApiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setUserData(res.data?.users);
                setTotalPages(res?.data?.pageInfo?.totalPages)
                setPage(res?.data?.pageInfo?.currentPage)
                setLoading(false);
            })
            .catch((error) => {
                enqueueSnackbar('Something went wrong while fetching data', {
                    variant: 'error',
                });
                setLoading(false);
            });
    };

    const handleSearch = (e) => {
        setSearchString(e.target.value);

        if (searchTimeout) {
            clearTimeout(searchTimeout);
        }

        const newSearchTimeout = setTimeout(() => {
            fetchUsersList(e.target.value);
        }, 1200);

        setSearchTimeout(newSearchTimeout);
    }

    return (
        <div>
            <h4 className='pb-3 md:pb-5 border-b-2 border-primaryBlue font-semibold text-primaryBlue pl-3 md:pl-5 mb-3 md:mb-5 text-2xl md:text-3xl'>
                User Management
            </h4>
            <div className='flex flex-col'>
                <div className='flex items-center flex-wrap gap-4 mb-3'>
                    <div className='flex items-center'>
                        <input
                            type='text'
                            name='search'
                            id='search'
                            placeholder='Search...'
                            value={searchString}
                            onChange={handleSearch}
                            className='outline-none px-3 py-2 pr-6 rounded text-sm w-32 h-[30px] text-[12px] border border-slate-300 hover:border-slate-700'
                        />
                        <AiOutlineSearch className='ml-[-20px] cursor-pointer hover:scale-105 transition' />
                    </div>
                    <TextField
                        select
                        name='type'
                        label='Role'
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className='bg-white text-xs w-32'
                        SelectProps={{
                            style: {
                                fontSize: '12px',
                                height: '30px',
                            },
                        }}
                        InputProps={{ style: { fontSize: '12px' } }}
                    >
                        {roleOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        select
                        name='type'
                        label='Status'
                        value={approved}
                        onChange={(e) => setApproved(e.target.value)}
                        className='bg-white text-xs w-32'
                        SelectProps={{
                            style: {
                                fontSize: '12px',
                                height: '30px',
                            },
                        }}
                        InputProps={{ style: { fontSize: '12px' } }}
                    >
                        {verificationOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                                {option.label}
                            </MenuItem>
                        ))}
                    </TextField>
                    {
                        userRole === "Superadmin" && (
                            <TextField
                                select
                                name='university'
                                label='University'
                                value={university}
                                onChange={(e) => setUniversity(e.target.value)}
                                className='bg-white text-xs w-32'
                                SelectProps={{
                                    style: {
                                        fontSize: '12px',
                                        height: '30px',
                                    },
                                }}
                                InputProps={{ style: { fontSize: '12px' } }}
                            >
                                {[...approvedUniversities, { id: 'all', universityName: 'All' }]?.map((option) => (
                                    <MenuItem key={option.id} value={option.id}>
                                        {option.universityName}
                                    </MenuItem>
                                ))}
                            </TextField>
                        )
                    }
                </div>
            </div>
            {!loading ? (
                <div className='bg-white p-6 rounded-3xl overflow-x-scroll'>
                {userData && userData?.length > 0 ? 
                <>
                    <BootstrapTable keyField='_id' data={userData} columns={columns} />
                    <ResponsivePagination
                        current={page}
                        total={totalPages}
                        onPageChange={setPage}
                    />
                </> : <NoDataLottie message={"No user with these filters"} />}
                </div>
            ) : (
                <PageLoader />
            )}

            <UserDrawer userRole={userRole} drawerData={drawerData} open={openDrawer} fetchUsersList={fetchUsersList} onClose={() => {
                setDrawerData({})
                setOpenDrawer(false)
            }} />
        </div>
    );
};

export default UserList;
