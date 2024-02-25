
import asyncHandler from 'express-async-handler';
import Classroom from '../models/classroom.js';
import { createNotification } from '../utils/createNotification.js';

// Create Classroom - Route: POST - /api/classroom/create - PRIVATE - TEACHER
export const createClassroom = asyncHandler(async (req, res) => {
  try {
    const { title, description, classCode, universityId, teacherId } = req.body;

    const newClassroom = new Classroom({
      title,
      description,
      classCode,
      teacher: teacherId,
      university: universityId,
    });

    const createdClassroom = await newClassroom.save();

    res.status(201).json(createdClassroom);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get Classroom - Route: GET - /api/classroom/all - PRIVATE - TEACHER, STUDENT
export const getClassrooms = asyncHandler(async (req, res) => {
  try {
    const { _id, role } = req.user;

    let classrooms = [];

    if (role === 'Student') {
      classrooms = await Classroom.find({ 'students.user': _id })
        .populate('teacher', 'name profilePicture')
        .sort({ createdAt: -1 });
    } else if (role === 'Teacher') {
      classrooms = await Classroom.find({ teacher: _id })
        .populate('teacher', 'name profilePicture')
        .sort({ createdAt: -1 });
    } else {
      res.status(400).json({ message: 'Invalid user role' });
      return;
    }

    const classroomsData = classrooms.map((classroom) => ({
      classroomId: classroom._id,
      title: classroom.title,
      description: classroom.description,
      classCode: classroom.classCode,
      teacherName: classroom.teacher.name,
      teacherProfile: classroom.teacher.profilePicture,
      studentCount: classroom.students.length,
    }));

    res.status(200).json(classroomsData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Enroll Student in Classroom - Route: POST - /api/classroom/enroll - PRIVATE - STUDENT
export const enrollStudentInClassroom = asyncHandler(async (req, res) => {
  try {
    const { classroomId } = req.body;
    const studentId = req.user._id;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      res.status(404).json({ message: 'Classroom not found' });
      return;
    }

    const isEnrolled = classroom.students.some(
      (student) => student.user.toString() === studentId.toString() && student.isApproved
    );

    if (isEnrolled) {
      res.status(400).json({ message: 'You are already enrolled in the classroom' });
      return;
    }

    const isPendingApproval = classroom.students.some(
      (student) => student.user.toString() === studentId.toString() && !student.isApproved
    );


    if (isPendingApproval) {
      res.status(405).json({ message: 'Your enrollment is pending approval' });
      return;
    }

    classroom.students.push({ user: studentId, isApproved: false });
    await classroom.save();


      await createNotification(
        req.user._id,
        classroom.teacher,
        classroomId,
        `${req.user.name} has requested to join ${classroom.title}.`,
        'classroom_enrollment'
      );

    res.status(200).json({ message: 'Enrolled in the classroom. Awaiting approval.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Get All Students and Teachers in a Classroom - Route: GET - /api/classroom/members/:classroomId - PRIVATE - STUDENT TEACHER
export const getClassroomMembers = asyncHandler(async (req, res) => {
  const { classroomId } = req.params;

  try {
    const classroom = await Classroom.findById(classroomId)
      .populate('students.user', '_id name email roleNumber profilePicture')
      .populate('teacher', '_id name profilePicture');

    if (!classroom) {
      res.status(404).json({ message: 'Classroom not found' });
      return;
    }

    const students = classroom.students.map((student) => ({
      _id: student.user._id,
      name: student.user.name,
      email: student.user.email,
      roleNumber: student.user.roleNumber,
      profilePicture: student.user.profilePicture,
      isApproved: student.isApproved,
    }));

    const teacher = classroom.teacher
      ? {
        _id: classroom.teacher._id,
        name: classroom.teacher.name,
        profilePicture: classroom.teacher.profilePicture,
      }
      : null;

    res.status(200).json({ students, teacher });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Remove User from Classroom - Route: DELETE - /api/classroom/remove-user - PRIVATE - TEACHER
export const removeUserFromClassroom = asyncHandler(async (req, res) => {
  try {
    const { classroomId, userId } = req.body;

    const classroom = await Classroom.findById(classroomId);
    if (!classroom) {
      res.status(404).json({ message: 'Classroom not found' });
      return;
    }

    classroom.students.pull({ user: userId });

    await classroom.save();

    await createNotification(
      req.user._id,
      userId,
      classroomId,
      `${req.user.name} has removed you from ${classroom.title}.`,
      'classroom_removed'
    )

    res.status(200).json({ message: 'User removed from the classroom successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Approve User in Classroom - Route: PUT - /api/classroom/approve-user - PRIVATE - TEACHER
export const approveUserInClassroom = asyncHandler(async (req, res) => {
  try {
    const { classroomId, userId } = req.body;

    const classroom = await Classroom.findById(classroomId);

    const studentToApprove = classroom.students.find(
      (student) => student.user.toString() === userId && !student.isApproved
    );

    if (!studentToApprove) {
      res.status(400).json({ message: 'User not found or already approved' });
      return;
    }

    studentToApprove.isApproved = true;
    await classroom.save();

    await createNotification(
      req.user._id,
      userId,
      classroomId,
      `${req.user.name} has approved your request to join ${classroom.title}.`,
      'classroom_approved')

    res.status(200).json({ message: 'User approved in the classroom successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// Check if User is Approved in Classroom - Route: GET - /api/classroom/is-user-approved/:classroomId - PRIVATE - STUDENT, TEACHER

export const isUserApprovedInClassroom = asyncHandler(async (req, res) => {
  try {
    const { classroomId } = req.params;
    const userId = req.user._id;
    const isTeacher = req.user.role === "Teacher";

    const classroom = await Classroom.findById(classroomId);

    if (!classroom) {
      res.status(404).json({ message: 'Classroom not found' });
      return;
    }

    if (isTeacher) res.status(200).json({ isApproved: true });

    const isApproved = classroom.students.some(
      (student) => student.user.toString() === userId.toString() && student.isApproved
    );

    res.status(200).json({ isApproved });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
