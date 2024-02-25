import asyncHandler from 'express-async-handler';
import University from '../models/university.js';
import User from '../models/user.js';
import sendEmail from '../utils/sendEmail.js';
import { uploadToS3 } from '../utils/uploadToS3.js';
import mongoose from 'mongoose';

// Register University - Route: POST - /api/university/register - PUBLIC

export const registerUniversity = asyncHandler(async (req, res) => {
  const {
    name,
    domainEmail,
    province,
    websiteUrl,
    isApproved,
    representativeName,
    representativeEmail,
  } = req.body;

  const universityExists = await University.findOne({ domainEmail });
  const userExists = await User.findOne({ representativeEmail });

  if (universityExists || userExists) {
    res.status(409);
    throw new Error('University or User already exists');
  }

  const universityImageFiles = req.files['universityImages'];
  const hecLicenseFile = req.files['hecLicenseImage'][0];

  let universityImagesUploadUrls = [];
  let hecLicenseUploadedUrl = '';

  if (universityImageFiles && universityImageFiles.length > 0) {
    for (let i = 0; i < universityImageFiles.length; i++) {
      try {
        const fileExtension = universityImageFiles[i].originalname
          .split('.')
          .pop();
        const result = await uploadToS3(
          universityImageFiles[i].buffer,
          fileExtension
        );
        universityImagesUploadUrls.push(result.Location);
      } catch (err) {
        return res.status(500).json({
          message: 'Unable to process Image',
        });
      }
    }
  }

  if (hecLicenseFile) {
    try {
      const fileExtension = hecLicenseFile.originalname.split('.').pop();
      const result = await uploadToS3(hecLicenseFile.buffer, fileExtension);
      hecLicenseUploadedUrl = result.Location;
    } catch (err) {
      return res.status(500).json({
        message: 'Unable to process Image',
      });
    }
  }

  const university = await University.create({
    name,
    domainEmail,
    province,
    universityImages: universityImagesUploadUrls,
    websiteUrl,
    isApproved,
    representativeName,
    representativeEmail,
    hecLicenseImage: hecLicenseUploadedUrl,
  });

  if (university) {
    res.status(201).json({
      _id: university._id,
      name: university.name,
      domainEmail: university.domainEmail,
      province: university.province,
      websiteUrl: university.websiteUrl,
      isApproved: university.isApproved,
      representativeName: university.representativeName,
      representativeEmail: university.representativeEmail,
    });
  } else {
    res.status(400);
    throw new Error('Invalid university data');
  }
});

// Approve University - Route: PUT - /api/university/:id/approve - PRIVATE - SUPERADMIN

export const approveUniversity = asyncHandler(async (req, res) => {
  const isApproved = req.body.isApproved === true;
  const university = await University.findById(req.params.id);

  if (!university) {
    res.status(404);
    throw new Error('University not found');
  }

  if (university.isApproved) {
    res.status(400);
    throw new Error('University is already approved');
  }

  if (isApproved) {
    university.isApproved = isApproved;
    await university.save();

    const randomPassword = Math.random().toString(36).slice(-8);

    const adminUser = await User.create({
      name: university.representativeName,
      email: university.representativeEmail,
      password: randomPassword,
      role: 'Admin',
      isVerified: true,
      university: university._id,
      firstLogin: true,
    });

    university.admins.push(adminUser._id);
    await university.save();

    const emailSubject = 'Your University Admin Account has been Approved!';
    const emailContent = `Dear ${university.representativeName},\n\nYour admin account for ${university.name} has been approved and created.\n\nLogin credentials:\nEmail: ${university.representativeEmail}\nPassword: ${randomPassword}\n\nYou can log in at ${process.env.APP_URL}/login\n\nBest regards,\nThe University Team`;

    try {
      await sendEmail(
        university.representativeEmail,
        emailSubject,
        emailContent
      );
    } catch (error) {
      res.status(500);
      throw new Error('Email could not be sent');
    }

    res.json({ message: 'University approved and admin user created' });
  } else {
    const emailSubject = "Your University Licence doesn't seems to be legit!";
    const emailContent = `Dear ${university.representativeName},\n\nYour admin account for ${university.name} seems fishy.\n\nKindly try registering again with the valid license.\n\nBest regards,\nThe University Team`;

    try {
      await sendEmail(
        university.representativeEmail,
        emailSubject,
        emailContent
      );
    } catch (error) {
      res.status(500);
      throw new Error('Email could not be sent');
    }

    res.json({ message: 'Not approved.' });
  }
});

// Get all universities - Route: GET - /api/university - SUPERADMIN

export const getUniversities = asyncHandler(async (req, res) => {
  const { page = 1, pageSize = 10, isApproved, name } = req.query;

  let universityQuery = {};

  if (isApproved !== undefined) {
    universityQuery.isApproved = isApproved;
  }

  if (name) {
    universityQuery.name = { $regex: new RegExp(name, 'i') };
  }

  const totalUniversityCount = await University.countDocuments(universityQuery);

  const universities = await University.find(universityQuery)
    .skip((page - 1) * pageSize)
    .limit(Number(pageSize));

  if (universities.length > 0) {
    const totalPages = Math.ceil(totalUniversityCount / pageSize);

    res.json({
      universities,
      pageInfo: {
        currentPage: Number(page),
        totalPages,
        totalItems: totalUniversityCount,
      },
    });
  } else {
    res.json({
      universities: [],
      pageInfo: {
        currentPage: Number(page),
        totalPages: 0,
        totalItems: 0,
      },
    });
  }
});


// Get all approved universities - Route: GET - /api/university/approved - PUBLIC

export const getApprovedUniversities = asyncHandler(async (req, res) => {
  const universities = await University.find({ isApproved: true });
  const universityNames = universities.map((university) => ({ id: university._id, universityName: university.name }));
  
  res.json(universityNames);
});

// Get university by ID - Route: GET - /api/university/:id - SUPERADMIN

export const getUniversityById = asyncHandler(async (req, res) => {
  const university = await University.findById(req.params.id);

  if (university) {
    res.json(university);
  } else {
    res.status(404);
    throw new Error('University not found');
  }
});

// Get student count by date - Route: GET - /api/university/:id/students/count - SUPERADMIN
// export const getStudentCountByDate = asyncHandler(async (req, res) => {
//   const universityId = req.params.id;

//   const studentsCountByDate = await User.aggregate([
//     {
//       $match: {
//         university: new mongoose.Types.ObjectId(universityId),
//         role: 'Student',
//       },
//     },
//     {
//       $group: {
//         _id: {
//           year: { $year: '$createdAt' },
//           month: { $month: '$createdAt' },
//           day: { $dayOfMonth: '$createdAt' },
//         },
//         count: { $sum: 1 },
//       },
//     },
//     {
//       $project: {
//         date: {
//           $dateFromParts: {
//             year: '$_id.year',
//             month: '$_id.month',
//             day: '$_id.day',
//           },
//         },
//         count: 1,
//         _id: 0,
//       },
//     },
//     {
//       $sort: { date: 1 },
//     },
//   ]);

//   res.json(studentsCountByDate);
// });

