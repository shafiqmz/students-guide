import asyncHandler from 'express-async-handler';
import Post from '../models/post.js';
import User from '../models/user.js';
import mongoose from 'mongoose';
import Classroom from '../models/classroom.js';
import University from '../models/university.js';


// Get User, Teacher, and Student Counts Based on University - Route: get - /api/analytics/adminCounts - PRIVATE

export const getUserCounts = asyncHandler(async (req, res) => {
    try {
        const universityId = req.user.university;

        const totalUserCount = await User.countDocuments({ university: universityId });
        const teacherCount = await User.countDocuments({ role: 'Teacher', university: universityId });
        const studentCount = await User.countDocuments({ role: 'Student', university: universityId });
        const classroomCount = await Classroom.countDocuments({ university: universityId });
        const postReportsCount = await Post.countDocuments({
            university: universityId,
            'reports.0': { $exists: true },
        });

        res.json({
            totalUserCount,
            teacherCount,
            studentCount,
            postReportsCount,
            classroomCount
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User, Teacher, and Student Counts Based on University - Route: get - /api/analytics/superadminCounts - PRIVATE

export const getUserCountsSuperadmin = asyncHandler(async (req, res) => {
    try {
        const totalUserCount = await User.countDocuments();
        const teacherCount = await User.countDocuments({ role: 'Teacher' });
        const studentCount = await User.countDocuments({ role: 'Student' });
        const adminCount = await User.countDocuments({ role: 'Admin' });
        const superadminCount = await User.countDocuments({ role: 'Superadmin' });
        const universityCount = await University.countDocuments();
        const approvedUniversityCount = await University.countDocuments({ isApproved: true });
        const totalPosts = await Post.countDocuments({ isApproved: true });


        res.json({
            totalUserCount,
            teacherCount,
            studentCount,
            universityCount,
            approvedUniversityCount,
            adminCount,
            superadminCount,
            totalPosts
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Comparsion stats - Route: get - /api/analytics/comparsion/stats - PRIVATE

export const getComparsionStats = asyncHandler(async (req, res) => {
    try {
        const universityId = req.user.university; 

        const postCount = await Post.countDocuments({ university: universityId, isAnnouncement: false, isDeleted: false });
        const announcementCount = await Post.countDocuments({ university: universityId, isAnnouncement: true, isDeleted: false });

        const approvedPostCount = await Post.countDocuments({ university: universityId, isAnnouncement: false, isApproved: true, isDeleted: false, isAssignment: false });
        const notApprovedPostCount = await Post.countDocuments({ university: universityId, isAnnouncement: false, isApproved: false, isDeleted: false, isAssignment: false });

        const adminCount = await User.countDocuments({ role: 'Admin', university: universityId });
        const teacherCount = await User.countDocuments({ role: 'Teacher', university: universityId });

        const verifiedUserCount = await User.countDocuments({ isVerified: true, university: universityId });
        const notVerifiedUserCount = await User.countDocuments({ isVerified: false, university: universityId });

        const classroomsCount = await Classroom.countDocuments({ university: universityId });

        const stats = [
            [
                { type: 'Posts', value: postCount },
                { type: 'Announcements', value: announcementCount },
            ],
            [
                { type: 'Admin', value: adminCount },
                { type: 'Teacher', value: teacherCount },
            ],
            [
                { type: 'Approved Posts', value: approvedPostCount },
                { type: 'Not Approved Posts', value: notApprovedPostCount },
            ],
            [
                { type: 'Verified Users', value: verifiedUserCount },
                { type: 'Not Verified Users', value: notVerifiedUserCount },
            ],
            [
                { type: 'Classrooms', value: classroomsCount},
                { type: 'Teachers', value: teacherCount}
            ]
        ];
        
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Comparsion stats - Route: get - /api/analytics/comparsion/stats/superadmin - PRIVATE

export const getComparsionStatsSuperadmin = asyncHandler(async (req, res) => {
    try {
        const postCount = await Post.countDocuments({ isDeleted: false });
        const universityCount = await University.countDocuments({ isApproved: true });
        const teacherCount = await User.countDocuments({ role: 'Teacher' });
        const studentCount = await User.countDocuments({ role: 'Student' });
        const adminCount = await User.countDocuments({ role: 'Admin' });

        const approvedPostCount = await Post.countDocuments({ isAnnouncement: false, isApproved: true, isDeleted: false, isAssignment: false });
        const notApprovedPostCount = await Post.countDocuments({ isAnnouncement: false, isApproved: false, isDeleted: false, isAssignment: false });


        const verifiedUserCount = await User.countDocuments({ isVerified: true });
        const notVerifiedUserCount = await User.countDocuments({ isVerified: false });

        const classroomsCount = await Classroom.countDocuments();

        const stats = [
            [
                { type: 'Posts', value: postCount },
                { type: 'University Count', value: universityCount },
            ],
            [
                { type: 'University', value: universityCount },
                { type: 'Admin', value: adminCount },
                { type: 'Teacher', value: teacherCount },
                { type: 'Student', value: studentCount },
            ],
            [
                { type: 'University', value: universityCount },
                { type: 'Classroom', value: classroomsCount },
            ],
            [
                { type: 'Verified Users', value: verifiedUserCount },
                { type: 'Not Verified Users', value: notVerifiedUserCount },
            ],
            [
                { type: 'Approved Posts', value: approvedPostCount},
                { type: 'Non-approved Posts', value: notApprovedPostCount}
            ]
        ];
        
        res.json(stats);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get the latest 10 student counts by date - Route: GET - /api/analytics/students-count-by-date - Admin

export const getStudentCountByDate = asyncHandler(async (req, res) => {
    try {
        const universityId = req.user.university;

        const studentCountByDate = await User.aggregate([
            {
                $match: {
                    university: new mongoose.Types.ObjectId(universityId),
                    role: 'Student',
                    isVerified: true,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $limit: 10,
            },
        ]);

        const result = studentCountByDate.map((entry) => ({
            title: entry._id,
            count: entry.count,
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get the latest 10 student counts by date - Route: GET - /api/analytics/students-count-by-date/superadmin - SUPERADMIN

export const getUserCountByDateSuperadmin = asyncHandler(async (req, res) => {
    try {

        const studentCountByDate = await User.aggregate([
            {
                $match: {
                    isVerified: true,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $limit: 10,
            },
        ]);

        const result = studentCountByDate.map((entry) => ({
            title: entry._id,
            count: entry.count,
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get the latest 10 post counts by date - Route: GET - /api/analytics/posts-count-by-date - ADMIN

export const getPostsCountByDate = asyncHandler(async (req, res) => {
    try {
        const universityId = req.user.university;

        const postsCountByDate = await Post.aggregate([
            {
                $match: {
                    university: new mongoose.Types.ObjectId(universityId),
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $limit: 10,
            },
        ]);

        const result = postsCountByDate.map((entry) => ({
            title: entry._id,
            count: entry.count,
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get the latest 10 post counts by date - Route: GET - /api/analytics/posts-count-by-date/superadmin - SUPERADMIN

export const getPostsCountByDateSuperadmin = asyncHandler(async (req, res) => {
    try {

        const postsCountByDate = await Post.aggregate([
            {
                $match: {
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$createdAt' },
                    },
                    count: { $sum: 1 },
                },
            },
            {
                $limit: 10,
            },
        ]);

        const result = postsCountByDate.map((entry) => ({
            title: entry._id,
            count: entry.count,
        }));

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get top 5 contributors by post count - Route: GET - /api/analytics/top-contributors-by-post - SUPERADMIN

export const getTopContributorsByPost = asyncHandler(async (req, res) => {
    try {
        const universityId = req.user.university;

        const topContributorsByPost = await Post.aggregate([
            {
                $match: {
                    university: new mongoose.Types.ObjectId(universityId),
                    isDeleted: false,
                },
            },
            {
                $group: {
                    _id: '$user',
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: '$user._id',
                    title: '$user.name',
                    count: 1,
                },
            },
            {
                $sort: { posts: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        res.json(topContributorsByPost);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get top 5 users by total post likes received - Route: GET - /api/analytics/top-liked-users - SUPERADMIN

export const getTopLikedUsers = asyncHandler(async (req, res) => {
    try {
        const universityId = req.user.university;

        const topLikedUsers = await Post.aggregate([
            {
                $match: {
                    university: new mongoose.Types.ObjectId(universityId),
                    isDeleted: false,
                    isApproved: true,
                },
            },
            {
                $group: {
                    _id: '$user',
                    count: { $sum: { $size: { $ifNull: ['$likes', []] } } }, // Count the total likes received on approved posts
                },
            },
            {
                $lookup: {
                    from: 'users', // Assuming the users collection name is 'users'
                    localField: '_id',
                    foreignField: '_id',
                    as: 'user',
                },
            },
            {
                $unwind: '$user',
            },
            {
                $project: {
                    _id: '$user._id',
                    title: '$user.name',
                    count: 1,
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        res.json(topLikedUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get top 5 classrooms by number of approved posts - Route: GET - /api/analytics/top-classrooms-by-posts - Admin

export const getTopClassroomsByPosts = asyncHandler(async (req, res) => {
    try {
        const universityId = req.user.university;

        const topClassroomsByPosts = await Classroom.aggregate([
            {
                $match: {
                    university: new mongoose.Types.ObjectId(universityId),
                },
            },
            {
                $lookup: {
                    from: 'posts', // Assuming the posts collection name is 'posts'
                    localField: '_id',
                    foreignField: 'classroom',
                    as: 'posts',
                },
            },
            {
                $unwind: '$posts',
            },
            {
                $match: {
                    'posts.isDeleted': false,
                    'posts.isApproved': true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$title' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { approvedPosts: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        res.json(topClassroomsByPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get top 5 universities by number of approved posts - Route: GET - /api/analytics/top-universities-by-posts - Superadmin

export const getTopUniversitiesByPosts = asyncHandler(async (req, res) => {
    try {
        const universitiesByPosts = await University.aggregate([
            {
                $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'university',
                    as: 'posts',
                },
            },
            {
                $unwind: '$posts',
            },
            {
                $match: {
                    'posts.isDeleted': false,
                    'posts.isApproved': true,
                },
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$name' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        res.json(universitiesByPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get top 5 universities by number of users - Route: GET - /api/analytics/top-universities-by-users - Superadmin

export const getTopUniversitiesByUsers = asyncHandler(async (req, res) => {
    try {
        const universitiesByUsers = await University.aggregate([
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: 'university',
                    as: 'users',
                },
            },
            {
                $unwind: '$users',
            },
            {
                $group: {
                    _id: '$_id',
                    title: { $first: '$name' },
                    count: { $sum: 1 },
                },
            },
            {
                $sort: { count: -1 },
            },
            {
                $limit: 5,
            },
        ]);

        res.json(universitiesByUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
