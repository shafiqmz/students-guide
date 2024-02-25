import express from 'express';
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getAllUsers,
    getAllTeachers,
    getAllUsersWithFiltersAndPagination,
    getAllAdmins,
    getAllUsersByUniversity,
    getAllStudentsByUniversity,
    getAllTeachersByUniversity,
    getAllAdminsByUniversity,
    deleteUser,
    getUserById,
    updateUserRole,
    updateUserVerification,
    changePassword,
    forgotPassword,
    getUserNotifications,
} from '../controllers/user.js';

import {
    protect,
    isTeacher,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin,
    isTeacherOrAdminOrSuperAdmin,
} from '../middlewares/authMiddleware.js';
import multer from 'multer';

const router = express.Router();
let upload = multer({})


// Public Routes
router.post('/login', authUser);
router.post('/', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'roleVerificationImage', maxCount: 1 }
]), registerUser);
router.post('/forgot-password', forgotPassword);

// Protected Routes
router.use(protect);

// User Profile Routes

router.put('/change-password', changePassword);
router.get('/notifications/:userId', getUserNotifications);

router.route('/profile')
    .get(getUserProfile);

router.put('/profile/:id', upload.fields([
    { name: 'profilePicture', maxCount: 1 },
]), updateUserProfile);

// User Listing Routes
router.route('/all/users')
    .get(isSuperAdmin, getAllUsers);

router.route('/all/teachers')
    .get(isSuperAdmin, getAllTeachers);

router.route('/all')
    .get(isAdminOrSuperAdmin, getAllUsersWithFiltersAndPagination);

router.route('/all/admins')
    .get(isSuperAdmin, getAllAdmins);

// User Filtering Routes
router.route('/university/:university')
    .get(isAdminOrSuperAdmin, getAllUsersByUniversity);

router.route('/students/university/:university')
    .get(isTeacherOrAdminOrSuperAdmin, getAllStudentsByUniversity);

router.route('/teachers/university/:university')
    .get(isTeacherOrAdminOrSuperAdmin, getAllTeachersByUniversity);

router.route('/admins/university/:university')
    .get(isAdminOrSuperAdmin, getAllAdminsByUniversity);

// Individual User Routes
router.route('/:id')
    .get(getUserById)
    .delete(isTeacherOrAdminOrSuperAdmin, deleteUser);

// Update User Role
router.route('/update-role/:id')
    .put(isSuperAdmin, updateUserRole);

// Update User Verification Status
router.route('/:id/verify')
    .put(isAdminOrSuperAdmin, updateUserVerification);

export default router;
