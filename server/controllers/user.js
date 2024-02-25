import asyncHandler from 'express-async-handler';
import generateToken from '../utils/generateToken.js';
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';
import { uploadToS3 } from '../utils/uploadToS3.js';
import University from '../models/university.js';
import { generateRandomPassword } from '../utils/generateRandomPassword.js';
import Notification from './../models/notification.js';
import { createNotification } from '../utils/createNotification.js';

// Authenticate User and get token - Route: POST - /api/user/login - PUBLIC

export const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    if (user && !user.isVerified) {
      res.status(403);
      throw new Error('User not verified.');
    }

    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      university: user.university,
      bio: user.bio,
      graduation: user.graduation,
      interests: user.interests,
      skills: user.skills,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
      firstLogin: user.firstLogin,
      token: generateToken(user._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid credentials');
  }
});

// Register a new user - Route: POST - /api/user - PUBLIC

export const registerUser = asyncHandler(async (req, res) => {
  const {
    name,
    email,
    password,
    role,
    roleNumber,
    university,
    bio,
    graduation,
    interests,
    skills,
    isVerified,
  } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(409);
    throw new Error('User already exists');
  }

  const profilePictureFile =
    req.files['profilePicture'] ? req.files['profilePicture'][0] : null;
  const roleVerificationFile = req.files['roleVerificationImage'] ? req.files['roleVerificationImage'][0] : null;

  let profilePictureUploadedUrl = '';
  let roleVerificationUploadedUrl = '';

  if (profilePictureFile) {
    try {
      const fileExtension = profilePictureFile.originalname.split('.').pop();
      const result = await uploadToS3(profilePictureFile.buffer, fileExtension);
      profilePictureUploadedUrl = result.Location;
    } catch (err) {
      return res.status(500).json({
        message: 'Unable to process Image',
      });
    }
  }

  if (roleVerificationFile) {
    try {
      const fileExtension = roleVerificationFile.originalname.split('.').pop();
      const result = await uploadToS3(
        roleVerificationFile.buffer,
        fileExtension
      );
      roleVerificationUploadedUrl = result.Location;
    } catch (err) {
      return res.status(500).json({
        message: 'Unable to process Image',
      });
    }
  }

  const user = await User.create({
    profilePicture: profilePictureUploadedUrl,
    name,
    email,
    password,
    role,
    roleNumber,
    university,
    graduation,
    interests,
    skills,
    bio,
    roleVerificationImage: roleVerificationUploadedUrl,
    isVerified,
    firstLogin: false,
  });

  if (user) {

    const universityAdmins = await User.find({
      university: user.university,
      role: 'Admin', 
    });

    universityAdmins.forEach(async (admin) => {
      await createNotification(
        user._id,
        admin._id,
        user.university,
        `A new ${user.role} has registered: ${user.name}`,
        'user_registration'
      );
    });
    
    return res.status(201).json({
      isVerified: false,
      message: 'Successfully created user. Your account needs to be verified.',
    });
  } else {
    return res.status(400).json({
      message: 'User could not be created',
    });
  }
});

// Forgot Password - Route: POST - /api/user/forgot-password - PUBLIC

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const randomPassword = generateRandomPassword();

  user.password = randomPassword;
  user.firstLogin = true;

  const emailSubject = 'Password Reset Request';
  const emailContent = `You are receiving this email because you (or someone else) has requested the reset of the password for your account.\n\nYour new password is: ${randomPassword}\n\nRegards, The Students Guide Official`;

  try {
    await sendEmail(user.email, emailSubject, emailContent);
    await user.save();
    res.json({ message: 'Email sent with reset instructions' });
  } catch (error) {
    res.status(500);
    throw new Error('Email could not be sent');
  }
});

// Change Password - Route: PUT - /api/user/change-password - PRIVATE

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    const { currentPassword, newPassword } = req.body;

    if (await user.matchPassword(currentPassword)) {
      user.password = newPassword;

      if (user.firstLogin) {
        user.firstLogin = false;
      }

      const updatedUser = await user.save();

      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        bio: updatedUser.bio,
        interests: updatedUser.interests,
        skills: updatedUser.skills,
        profilePicture: updatedUser.profilePicture,
        firstLogin: updatedUser.firstLogin,
        message: 'Password updated successfully',
      });
    } else {
      res.status(401);
      throw new Error('Current password is incorrect');
    }
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get Logged In User - Route: GET - /api/user/profile - PRIVATE

export const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('university', 'name');;
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleNumber: user.roleNumber,
      university: user.university?._id,
      universityName: user.university?.name,
      bio: user.bio,
      graduation: user.graduation,
      interests: user.interests,
      skills: user.skills,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update User Profile - Route: PUT - /api/user/profile/:id - PRIVATE

export const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.bio = req.body.bio || user.bio;
    user.role = req.body.role || user.role;
    user.roleNumber = req.body.roleNumber || user.roleNumber;
    user.interests = req.body.interests || user.interests;
    user.skills = req.body.skills || user.skills;
    user.isVerified = typeof req.body.isVerified !== 'undefined' ? req.body.isVerified : user.isVerified;

    let profilePictureUploadedUrl = '';
    const profilePictureFile = req.files && req.files['profilePicture'] && req.files['profilePicture'][0];

    if (profilePictureFile) {
      try {
        const fileExtension = profilePictureFile.originalname.split('.').pop();
        const result = await uploadToS3(profilePictureFile.buffer, fileExtension);
        profilePictureUploadedUrl = result.Location;
      } catch (err) {
        return res.status(500).json({
          message: 'Unable to process Image',
        });
      }
    }

    user.profilePicture = profilePictureUploadedUrl === "" ? user.profilePicture : profilePictureUploadedUrl;

    const updatedUser = await user.save();

    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Get All Users - Route: GET - /api/user/all - PRIVATE - SuperAdmin

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error('No User found');
  }
});

// Get All Students - Route: GET - /api/user/all - PRIVATE - Admin or SuperAdmin

export const getAllUsersWithFiltersAndPagination = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10, isVerified, email, role, university } = req.query;
  const user = req.user;

  try {
    let userQuery = {};

    if (user.role === 'Admin') {
      userQuery.university = user.university;
    }

    userQuery._id = { $ne: user._id };

    if (isVerified !== undefined) {
      userQuery.isVerified = isVerified;
    }

    if (email) {
      userQuery.$or = [
        { email: { $regex: new RegExp(email, 'i') } },
        { roleNumber: { $regex: new RegExp(email, 'i') } },
        { name: { $regex: new RegExp(email, 'i') } },
      ];
    }

    if (role) {
      userQuery.role = role;
    }

    if (university) {
      userQuery.university = university;
    }

    console.log(userQuery)

    const totalUserCount = await User.countDocuments(userQuery);

    const users = await User.find(userQuery)
      .populate('university', 'name')
      .skip((page - 1) * pageSize)
      .limit(Number(pageSize));

    if (users.length > 0) {
      const totalPages = Math.ceil(totalUserCount / pageSize);

      res.json({
        users,
        pageInfo: {
          currentPage: Number(page),
          totalPages,
          totalItems: totalUserCount,
        },
      });
    } else {
      res.json({
        users: [],
        pageInfo: {
          currentPage: Number(page),
          totalPages: 0,
          totalItems: 0,
        },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


// Get All Teachers - Route: GET - /api/user/teachers - PRIVATE - SuperAdmin

export const getAllTeachers = asyncHandler(async (req, res) => {
  const teachers = await User.find({ role: 'Teacher' });
  if (teachers) {
    res.json(teachers);
  } else {
    res.status(404);
    throw new Error('No Teacher found');
  }
});

// Get All Admins - Route: GET - /api/user/admins - PRIVATE - SuperAdmin

export const getAllAdmins = asyncHandler(async (req, res) => {
  const admins = await User.find({ role: 'Admin' });
  if (admins) {
    res.json(admins);
  } else {
    res.status(404);
    throw new Error('No Admin found');
  }
});

// Get All Users by University - Route: GET - /api/user/university/:university - PRIVATE - Admin, SuperAdmin

export const getAllUsersByUniversity = asyncHandler(async (req, res) => {
  const users = await User.find({ university: req.params.university });
  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error('No User found');
  }
});

// Get All Students by University - Route: GET - /api/user/students/university/:university - PRIVATE - Teacher, Admin, SuperAdmin

export const getAllStudentsByUniversity = asyncHandler(async (req, res) => {
  const students = await User.find({
    role: 'Student',
    university: req.params.university,
  });
  if (students) {
    res.json(students);
  } else {
    res.status(404);
    throw new Error('No Student found');
  }
});

// Get All Teachers by University - Route: GET - /api/user/teachers/university/:university - PRIVATE - Teacher, Admin, SuperAdmin

export const getAllTeachersByUniversity = asyncHandler(async (req, res) => {
  const teachers = await User.find({
    role: 'Teacher',
    university: req.params.university,
  });
  if (teachers) {
    res.json(teachers);
  } else {
    res.status(404);
    throw new Error('No Teacher found');
  }
});

// Get All Admins by University - Route: GET - /api/user/admins/university/:university - PRIVATE - Admin, SuperAdmin

export const getAllAdminsByUniversity = asyncHandler(async (req, res) => {
  const admins = await User.find({
    role: 'Admin',
    university: req.params.university,
  });
  if (admins) {
    res.json(admins);
  } else {
    res.status(404);
    throw new Error('No Admin found');
  }
});

// Delete User - Route: DELETE - /api/user/:id - PRIVATE - Teacher, Admin, SuperAdmin

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.deleteOne();
    res.json({ message: 'User Removed' });
  } else {
    res.status(404);
    throw new Error('No User found');
  }
});

// Get User By Id - Route: GET - /api/user/:id - PRIVATE - Teacher, Admin, SuperAdmin

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password').populate('university', 'name');
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      roleNumber: user.roleNumber,
      university: user.university?._id,
      universityName: user.university?.name,
      bio: user.bio,
      graduation: user.graduation,
      interests: user.interests,
      skills: user.skills,
      profilePicture: user.profilePicture,
      createdAt: user.createdAt,
    });
  } else {
    res.status(404);
    throw new Error('No User found');
  }
});

// Update User - Route: PUT - /api/user/update-role/:id - PRIVATE - SuperAdmin

export const updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.role = req.body.role || user.role;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// Update User Verification - Route: PUT - /api/user/:id/verify - PRIVATE - Admin, SuperAdmin

export const updateUserVerification = asyncHandler(async (req, res) => {
  const isApproved = req.body.isVerified === true;
  const user = await User.findById(req.params.id);
  if (user) {
    user.isVerified = isApproved;

    const updatedUser = await user.save();

    const emailSubject = isApproved
      ? 'Your Account has been verified!'
      : "Sorry! It seems like the verification document you provided doesn't look legit.";
    const emailContent = isApproved
      ? `Dear ${user.name},\n\nYour account has been approved and created.\n\nYou can log in at URL\n\nBest regards,\nThe Management Team`
      : 'Kindly register again with a valid document.\n\nBest regards,\nThe Management Team';

    try {
      await sendEmail(user.email, emailSubject, emailContent);
    } catch (error) {
      res.status(500);
      throw new Error('Email could not be sent');
    }

    let targetList = 'students'
    if (user.role === 'Teacher') {
      targetList = 'teachers';
    }

    const university = await University.findById(user.university);

    if (university) {
      university[targetList].push(user._id);
      await university.save();
    }

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      isVerified: updatedUser.isVerified,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

export const getUserNotifications = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await User.findById(userId);
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  const notifications = await Notification.find({ receiver: userId })
    .populate('sender', 'name profilePicture')
    .sort({ createdAt: -1 });

  res.json(notifications);
});