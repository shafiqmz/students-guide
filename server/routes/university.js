import express from 'express';
import {
    registerUniversity,
    approveUniversity,
    getUniversities,
    getUniversityById,
    getApprovedUniversities,
} from '../controllers/university.js';

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
router.post('/register', upload.fields([
    { name: 'hecLicenseImage', maxCount: 1 },
    { name: 'universityImages', maxCount: 10 }
]), registerUniversity);

router.get('/approved', getApprovedUniversities);

// Protected Routes
router.use(protect);

// University Approval Route
router.route('/:id/approve')
    .put(isSuperAdmin, approveUniversity);

// University Listing Routes
router.route('/')
    .get(isSuperAdmin, getUniversities);

router.route('/:id')
    .get(isSuperAdmin, getUniversityById);
    
export default router;
