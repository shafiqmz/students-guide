
import { approvePost, commentOnPost, createPost,ignoreAllReports, deletePost, getPosts, getUserPostsById, likePost, reportPost, savePost, getClassroomPostsByClassId, getSavedPostsById, getPostById, getClassroomPostByPostId } from '../controllers/post.js';
import {
    protect,
    isTeacher,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin,
    isTeacherOrAdminOrSuperAdmin,
} from '../middlewares/authMiddleware.js';
import multer from 'multer';
import express from "express";

const router = express.Router();
let upload = multer({})

// Protected Routes
router.use(protect);

router.post('/create-post', upload.fields([
    { name: 'media', maxCount: 10 }
]), createPost);

router.get('/', getPosts);
router.get('/:postId', getPostById);
router.get('/saved/posts', getSavedPostsById);
router.get('/classroom/:classroomId', getClassroomPostsByClassId);
router.get('/classroom/:classroomId/:postId', getClassroomPostByPostId);
router.get('/user/:userId', getUserPostsById);
router.post('/like/:postId', likePost);
router.post('/save/:postId', savePost);
router.post('/report/:postId', reportPost);
router.delete('/delete/:postId', isTeacherOrAdminOrSuperAdmin, deletePost);
router.put('/ignore-reports/:postId', isTeacherOrAdminOrSuperAdmin, ignoreAllReports);
router.put('/approve/:postId', isTeacherOrAdminOrSuperAdmin, approvePost);
router.post('/comment/:postId', upload.fields([
    { name: 'attachment', maxCount: 1 },
]), commentOnPost);

export default router;