import express from 'express';
import {
    createJob,
    getAllJobs,
    getJobById,
    deleteJob,
    saveJob
} from '../controllers/job.js';

import {
    protect,
    isSuperAdmin,
} from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public Routes
router.post('/create', createJob);

router.get('/', getAllJobs);
router.get('/:jobId', getJobById);

// Protected Routes
router.use(protect);
router.put('/save/:jobId', saveJob);

// Admin and SuperAdmin Routes
router.use(isSuperAdmin);

router.route('/:jobId')
    .delete(deleteJob);

export default router;
