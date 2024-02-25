'use client';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import React, { useEffect, useState } from 'react';
import { AiOutlineSearch } from '@react-icons/all-files/ai/AiOutlineSearch';
import { Avatar, MenuItem, TextField } from '@mui/material';
import axios from 'axios';
import { useSnackbar } from 'notistack';
import BootstrapTable from 'react-bootstrap-table-next';
import PageLoader from '@/components/General/PageLoader';
import UniversityDrawer from '@/components/General/UniversityDrawer';
import ResponsivePagination from 'react-responsive-pagination';
import 'react-responsive-pagination/themes/classic.css';
import NoDataLottie from '@/components/General/NoDataLottie';

const UniversityList = () => {
    const PAGESIZE = 10;
    const [page, setPage] = useState(1);
    const [universityData, setUniversityData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [approved, setApproved] =
        useState('all');
    const [openDrawer, setOpenDrawer] = useState(false);
    const [drawerData, setDrawerData] = useState({})
    const token = JSON.parse(localStorage.getItem('token'));
    const { enqueueSnackbar } = useSnackbar();
    const [totalPages, setTotalPages] = useState(1);
    const [searchString, setSearchString] = useState("");
    const [searchTimeout, setSearchTimeout] = useState(null);

    const columns = [
        {
            dataField: 'name',
            text: 'Name',
            headerStyle: { width: '150px', textAlign: 'center' },
            style: { width: '150px' },
            formatter: (cell, row) => {
                return (
                    <div>{`${row?.name}`}</div>
                );
            },
        },
        {
            dataField: 'domainEmail',
            text: 'Domain Email',
            headerStyle: { width: '250px', textAlign: 'center' },
            style: { width: '250px' },
        },
        {
            dataField: 'province',
            text: 'Province',
            headerStyle: { width: '200px', textAlign: 'center' },
            style: { width: '200px' },
        },
        {
            dataField: 'representativeEmail',
            text: 'Representative',
            headerStyle: { width: '250px', textAlign: 'center' },
            style: { width: '250px' },
        },
        {
            dataField: 'isApproved',
            text: 'Approval Status',
            headerStyle: { width: '100', textAlign: 'center' },
            style: { width: '100' },
            formatter: (cell, row) => {
                return (
                    <div
                        className={`${row?.isApproved ? 'bg-green-300' : 'bg-red-300'
                            } text-white p-2 text-center`}
                    >
                        {row?.isApproved ? 'Yes' : 'No'}
                    </div>
                );
            },
            headerStyle: { width: '150px', textAlign: 'center' },
            style: { width: '150px' },
        },
        {
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
        },
    ];

    const verificationOptions = [
        {
            label: 'All',
            value: 'all',
        },
        {
            label: 'Approved',
            value: true,
        },
        {
            label: 'Not Approved',
            value: false,
        },
    ];


    useEffect(() => {
        fetchUniversityList();
    }, [page, approved]);

    const fetchUniversityList = (searchString = '') => {
        setLoading(true);

        const apiUrl = `${process.env.API_URL}university/`;

        const queryParams = {
            pageSize: PAGESIZE,
            page: page,
        };

        if (approved !== 'all') {
            queryParams.isApproved = approved;
        }

        queryParams.name = searchString;

        const queryString = new URLSearchParams(queryParams).toString();

        const filteredApiUrl = `${apiUrl}?${queryString}`; 
        axios
            .get(filteredApiUrl, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((res) => {
                setUniversityData(res.data?.universities);
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
            fetchUniversityList(e.target.value);
        }, 1200);

        setSearchTimeout(newSearchTimeout);
    }

    return (
        <div>
            <h4 className='pb-3 md:pb-5 border-b-2 border-primaryBlue font-semibold text-primaryBlue pl-3 md:pl-5 mb-3 md:mb-5 text-2xl md:text-3xl'>
                University Management
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
                   
                </div>
            </div>
            {!loading ? (
                <div className='bg-white p-6 rounded-3xl overflow-x-scroll'>
                {universityData && universityData?.length > 0 ? 
                <>
                    <BootstrapTable keyField='_id' data={universityData} columns={columns} />
                    <ResponsivePagination
                        current={page}
                        total={totalPages}
                        onPageChange={setPage}
                    />
                </> : <NoDataLottie message={"No university with these filters"} />}
                </div>
            ) : (
                <PageLoader />
            )}

            <UniversityDrawer drawerData={drawerData} open={openDrawer} fetchUniversityList={fetchUniversityList} onClose={() => {
                setDrawerData({})
                setOpenDrawer(false)
            }} />
        </div>
    );
};

export default UniversityList;
