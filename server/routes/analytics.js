import express from "express";
import {
    protect,
    isTeacher,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin,
    isTeacherOrAdminOrSuperAdmin,
} from '../middlewares/authMiddleware.js';
import { getComparsionStats, getPostsCountByDateSuperadmin, getTopUniversitiesByPosts, getUserCountsSuperadmin, getComparsionStatsSuperadmin, getPostsCountByDate, getUserCountByDateSuperadmin, getStudentCountByDate, getTopClassroomsByPosts, getTopContributorsByPost, getTopLikedUsers, getUserCounts,getTopUniversitiesByUsers } from "../controllers/analytics.js";

const router = express.Router();

router.use(protect);
router.get('/adminCounts', isAdmin, getUserCounts);
router.get('/superadminCounts', isSuperAdmin, getUserCountsSuperadmin);
router.get('/comparsion/stats', isAdmin, getComparsionStats);
router.get('/comparsion/stats/superadmin', isSuperAdmin, getComparsionStatsSuperadmin);
router.get('/students-count-by-date', isAdmin, getStudentCountByDate);
router.get('/user-count-by-date/superadmin', isSuperAdmin, getUserCountByDateSuperadmin);
router.get('/posts-count-by-date', isAdmin, getPostsCountByDate);
router.get('/posts-count-by-date/superadmin', isSuperAdmin, getPostsCountByDateSuperadmin);
router.get('/total-contributors-by-post', isAdmin, getTopContributorsByPost);
router.get('/top-classrooms-by-posts', isAdmin, getTopClassroomsByPosts);
router.get('/top-universities-by-posts', isSuperAdmin, getTopUniversitiesByPosts);
router.get('/top-liked-users', isAdmin, getTopLikedUsers);
router.get('/top-universities-by-users', isSuperAdmin, getTopUniversitiesByUsers);

export default router;