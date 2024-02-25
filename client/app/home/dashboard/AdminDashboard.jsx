"use client"

import React, { useEffect, useState } from 'react'
import Doughnut from './Components/Doughnut';
import PieChart from './Components/PieChart';
import LineChart from './Components/LineChart';
import BarChart from './Components/BarChart';
import HorizontalBar from './Components/HorizontalBar';
import axios from 'axios';
import { useSnackbar } from "notistack"
import PageLoader from '@/components/General/PageLoader';

const AdminDashboard = () => {
    const [counts, setCounts] = useState();
    const [loading, setLoading] = useState(false);
    const [comparsionStats, setComparsionStats] = useState();
    const [studentsCountByDate, setStudentsCountByDate] = useState();
    const [totalContributorsByPost, setTotalContributorsByPost] = useState();
    const [postsCountByDate, setPostsCountByDate] = useState();
    const [topLikedUsers, setTopLikedUsers] = useState();
    const [topClassrooms, setTopClassrooms] = useState();
    const token = JSON.parse(localStorage.getItem('token'));
    const { enqueueSnackbar } = useSnackbar();

    useEffect(() => {
        fetchAdminAnalyticsData();
    }, []);

    const fetchAdminAnalyticsData = () => {
        setLoading(true);

        const apiCalls = [
            axios.get(`${process.env.API_URL}analytics/adminCounts`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/comparsion/stats`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/students-count-by-date`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/total-contributors-by-post`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/posts-count-by-date`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/top-liked-users`, { headers: { Authorization: `Bearer ${token}` } }),
            axios.get(`${process.env.API_URL}analytics/top-classrooms-by-posts`, { headers: { Authorization: `Bearer ${token}` } })
        ];

        Promise.all(apiCalls)
            .then(([countsRes, comparsionStatsRes, studentsCountByDateRes, totalContributorsByPostRes, postsCountByDateRes, topLikedUsersRes, topClassrooms]) => {
                setCounts(countsRes?.data);
                setComparsionStats(comparsionStatsRes?.data);
                setStudentsCountByDate(studentsCountByDateRes?.data);
                setTotalContributorsByPost(totalContributorsByPostRes?.data);
                setPostsCountByDate(postsCountByDateRes?.data);
                setTopLikedUsers(topLikedUsersRes?.data);
                setTopClassrooms(topClassrooms?.data)
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
                        <div className='risk-box flex flex-col items-center h-full'>
                            <div className='text-center my-2 font-semibold'>Users</div>
                            <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.totalUserCount}</div>
                        </div>
                    </div>
                    <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                        <div className='risk-box flex flex-col items-center h-full'>
                            <div className='text-center my-2 font-semibold'>Students</div>
                            <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.studentCount}</div>
                        </div>
                    </div>
                    <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                        <div className='risk-box flex flex-col items-center h-full'>
                            <div className='text-center my-2 font-semibold'>Teachers</div>
                            <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.teacherCount}</div>
                        </div>
                    </div>
                    <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                        <div className='risk-box flex flex-col items-center h-full'>
                            <div className='text-center my-2 font-semibold'>Classrooms</div>
                            <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.classroomCount}</div>
                        </div>
                    </div>
                    <div className="h-40 bg-white shadow-lg w-full xs:w-[45%] sm:w-[30%] lg:w-[23%] rounded-xl p-2">
                        <div className='risk-box flex flex-col items-center h-full'>
                            <div className='text-center my-2 font-semibold'>Reported Posts</div>
                            <div className="text-center my-auto text-6xl font-bold text-primaryBlue">{counts?.postReportsCount}</div>
                        </div>
                    </div>

                    {
                        comparsionStats && comparsionStats?.length > 0 &&
                        <>
                            <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                <Doughnut title="Teachers and Admin" data={comparsionStats[1]} />
                            </div>
                            <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                <Doughnut title="Posts and Announcements" data={comparsionStats[0]} />
                            </div>
                            <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                <PieChart title="Teachers and Classrooms" data={comparsionStats[4]} />
                            </div>
                            <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                <PieChart title="Approved/Not-Approved Posts" data={comparsionStats[2]} />
                            </div>
                            <div className="h-60 bg-white shadow-lg w-full sm:w-[45%] lg:w-[30%]  rounded-xl p-2">
                                <Doughnut title="Verified/Not-Verified Users" data={comparsionStats[3]} />
                            </div>
                        </>
                    }
                    {
                        studentsCountByDate &&
                        <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                            <LineChart title="Students Count by Day" data={studentsCountByDate} />
                        </div>
                    }

                    {
                        topClassrooms &&
                        <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                            <BarChart title="Active classrooms" data={topClassrooms} />
                        </div>
                    }

                    {
                        totalContributorsByPost &&
                        <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                            <BarChart title="Top Contributors by Posts" forType="contributors" data={totalContributorsByPost} />
                        </div>
                    }

                    {
                        postsCountByDate &&
                        <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                            <BarChart title="Posts Count by Day" forType="posts" data={postsCountByDate} />
                        </div>
                    }

                    {
                        topLikedUsers &&
                        <div className="bg-white shadow-lg w-full rounded-xl p-2 h-[400px]">
                            <HorizontalBar title="Top Contributors by Likes" data={topLikedUsers} />
                        </div>
                    }

                </div>
            )}
        </>
    )
}

export default AdminDashboard