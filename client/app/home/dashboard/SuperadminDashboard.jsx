"use client"

import React, { useEffect, useState } from 'react'
import Doughnut from './Components/Doughnut';
import PieChart from './Components/PieChart';
import LineChart from './Components/LineChart';
import BarChart from './Components/BarChart';
import axios from 'axios';
import { useSnackbar } from "notistack"
import HorizontalBar from './Components/HorizontalBar';
import PageLoader from '@/components/General/PageLoader';

const SuperadminDashboard = () => {
    const [counts, setCounts] = useState();
    const [comparsionStats, setComparsionStats] = useState();
    const [userCountByDate, setUserCountByDate] = useState();
    const [postsCountByDate, setPostsCountByDate] = useState();
    const [topUniversitiesByPosts, setTopUniversitiesByPosts] = useState();
    const [topUniversitiesByUsers, setTopUniversitiesByUsers] = useState();
    const [loading, setLoading] = useState(false);
    const token = JSON.parse(localStorage.getItem('token'));
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchAdminAnalyticsData();
    }, []);

    const fetchAdminAnalyticsData = () => {
        setLoading(true);

        const apiCalls = [
            axios.get(`${process.env.API_URL}analytics/superadminCounts`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/comparsion/stats/superadmin`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/user-count-by-date/superadmin`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/posts-count-by-date/superadmin`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/top-universities-by-posts`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/top-universities-by-users`, { headers: { Authorization: `Bearer ${token}` } })
        ];

        Promise.all(apiCalls)
            .then(([countsRes, comparsionStatsRes, userCountByDateRes, postsCountByDateRes, topUniversitiesByPostsRes, topUniversitiesByUsersRes, topLikedUsersRes]) => {
                setCounts(countsRes?.data);
                setComparsionStats(comparsionStatsRes?.data);
                setUserCountByDate(userCountByDateRes?.data);
                setPostsCountByDate(postsCountByDateRes?.data);
                setTopUniversitiesByPosts(topUniversitiesByPostsRes?.data)
                setTopUniversitiesByUsers(topUniversitiesByUsersRes?.data)
            })
            .catch((err) => {
                enqueueSnackbar("Something went wrong", { variant: "error" });
            })
            .finally(() => setLoading(false));
    }

    return (
        <>
            {loading ?
                <PageLoader /> :
                (
                    <div className="flex gap-4 flex-wrap justify-center pt-8 pb-20 px-2 xs:px-4 sm:px-6 md:px-8 lg:px-10 h-screen overflow-y-auto">
                        <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                            <div className='flex flex-col items-center h-full'>
                                <div className='text-center my-2 font-semibold'>Total Users</div>
                                <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.totalUserCount}</div>
                            </div>
                        </div>
                        <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                            <div className='flex flex-col items-center h-full'>
                                <div className='text-center my-2 font-semibold'>Total Students</div>
                                <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.studentCount}</div>
                            </div>
                        </div>
                        <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                            <div className='flex flex-col items-center h-full'>
                                <div className='text-center my-2 font-semibold'>Total Teachers</div>
                                <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.teacherCount}</div>
                            </div>
                        </div>
                        <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                            <div className='flex flex-col items-center h-full'>
                                <div className='text-center my-2 font-semibold'>Total Admins</div>
                                <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.adminCount}</div>
                            </div>
                        </div>
                        <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                            <div className='flex flex-col items-center h-full'>
                                <div className='text-center my-2 font-semibold'>Total Superadmins</div>
                                <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.superadminCount}</div>
                            </div>
                        </div>
                        <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                            <div className='flex flex-col items-center h-full'>
                                <div className='text-center my-2 font-semibold'>Total Universities</div>
                                <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.universityCount}</div>
                            </div>
                        </div>
                        <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                            <div className='flex flex-col items-center h-full'>
                                <div className='text-center my-2 font-semibold'>Approved Universities</div>
                                <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.approvedUniversityCount}</div>
                            </div>
                        </div>
                        <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                            <div className='flex flex-col items-center h-full'>
                                <div className='text-center my-2 font-semibold'>Total Posts</div>
                                <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.totalPosts}</div>
                            </div>
                        </div>

                        {
                            comparsionStats && comparsionStats?.length > 0 &&
                            <>
                                <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                    <Doughnut title="Posts and University" data={comparsionStats[0]} />
                                </div>
                                <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                    <Doughnut title="University and Classroom" data={comparsionStats[2]} />
                                </div>
                                <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                    <PieChart title="University Comparsion" data={comparsionStats[1]} />
                                </div>
                                <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                    <PieChart title="Verified/Not-Verified Users" data={comparsionStats[3]} />
                                </div>
                                <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                    <PieChart title="Approved/Not-Approved Posts" data={comparsionStats[4]} />
                                </div>
                            </>
                        }
                        {
                            userCountByDate &&
                            <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                                <LineChart title="Users Count by Day" data={userCountByDate} />
                            </div>
                        }

                        {
                            postsCountByDate &&
                            <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                                <HorizontalBar title="Posts Count by Day" forType="posts" data={postsCountByDate} />
                            </div>
                        }

                        {
                            topUniversitiesByPosts &&
                            <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                                <BarChart title="Top Universities By Posts" data={topUniversitiesByPosts} />
                            </div>
                        }

                        {
                            topUniversitiesByUsers &&
                            <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                                <BarChart title="Top Universities By Users" data={topUniversitiesByUsers} />
                            </div>
                        }

                    </div>
                )}
        </>
    )
}

export default SuperadminDashboard