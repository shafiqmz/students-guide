import { approveUserInClassroom, createClassroom, enrollStudentInClassroom, getClassroomMembers, getClassrooms, isUserApprovedInClassroom, removeUserFromClassroom } from '../controllers/classroom.js';
import {
    protect,
    isTeacher,
    isAdmin,
    isSuperAdmin,
    isAdminOrSuperAdmin,
    isTeacherOrAdminOrSuperAdmin,
    isStudent,
} from '../middlewares/authMiddleware.js';
import express from "express";

const router = express.Router();

router.use(protect);

router.route('/all')
    .get(getClassrooms)
    
router.route('/members/:classroomId')
    .get(getClassroomMembers)

router.route('/is-user-approved/:classroomId')
    .get(isUserApprovedInClassroom)

router.route('/create')
    .post(isTeacher, createClassroom);
    
router.route('/enroll')
    .post(isStudent, enrollStudentInClassroom);

router.route('/remove-user')
    .put(isTeacher, removeUserFromClassroom);

router.route('/approve-user')
    .put(isTeacher, approveUserInClassroom);

export default router;
