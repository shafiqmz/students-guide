import asyncHandler from 'express-async-handler';
import Job from '../models/job.js';
import User from '../models/user.js';
import { parseISO, subDays } from 'date-fns';

// Create Job - Route: POST - /api/jobs/create - PUBLIC
export const createJob = asyncHandler(async (req, res) => {
  const {
    jobTitle,
    companyName,
    location,
    type,
    mode,
    range,
    contactEmail,
    jobDescription,
  } = req.body;

  const job = await Job.create({
    jobTitle,
    companyName,
    location,
    type,
    mode,
    range,
    contactEmail,
    jobDescription,
  });

  if (job) {
    res.status(201).json({
      _id: job._id,
      jobTitle: job.jobTitle,
      companyName: job.companyName,
      location: job.location,
      type: job.type,
      mode: job.mode,
      range: job.range,
      contactEmail: job.contactEmail,
      jobDescription: job.jobDescription,
    });
  } else {
    res.status(400);
    throw new Error('Invalid job data');
  }
});

// Get All Jobs with Filters - Route: GET - /api/jobs - PUBLIC

export const getAllJobs = asyncHandler(async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;

    let filters = {};

    if (req.query.location) {
      filters.location = { $regex: new RegExp(req.query.location, 'i') };
    }

    if (req.query.type) {
      filters.type = req.query.type;
    }

    if (req.query.mode) {
      filters.mode = req.query.mode;
    }

    if (req.query.daysAgo) {
      const daysAgo = parseInt(req.query.daysAgo);
      const startDate = subDays(new Date(), daysAgo);
      filters.timestamp = { $gte: startDate };
    }

    const count = await Job.countDocuments(filters);
    const totalPages = Math.ceil(count / pageSize);

    const jobs = await Job.find(filters)
      .sort({ _id: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize);

    res.status(200).json({
      jobs,
      pageInfo: {
        totalJobs: count,
        totalPages,
        currentPage: page,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Get Job by ID - Route: GET - /api/jobs/:jobId - PUBLIC

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.jobId);

  if (!job) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.status(200).json(job);
});

// Delete Job by ID - Route: DELETE - /api/jobs/:jobId - PRIVATE

export const deleteJob = asyncHandler(async (req, res) => {
  const deletedJob = await Job.findByIdAndDelete(req.params.jobId);

  if (!deletedJob) {
    res.status(404);
    throw new Error('Job not found');
  }

  res.status(204).send();
});

// Save Job - Route: PUT - /api/jobs/save/:jobId - PRIVATE

export const saveJob = asyncHandler(async (req, res) => {
  try {
    const jobId = req.params.jobId;
    const userId = req.user._id;

    const job = await Job.findById(jobId);
    const user = await User.findById(userId);

    if (!job) {
      return res.status(404).json({ error: 'Job not found' });
    }

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isJobSaved = job.savedBy.find(savedUserId => savedUserId.toString() === userId.toString());

    if (isJobSaved) {
      user.savedJobs = user.savedJobs.filter(savedJobId => savedJobId.toString() !== jobId.toString());
      job.savedBy = job.savedBy.filter(savedUserId => {
        return savedUserId.toString() !== userId.toString()
      });
    } else {
      user.savedJobs.push(jobId);
      job.savedBy.push(userId);
    }

    await Promise.all([user.save(), job.save()]);

    const message = isJobSaved ? 'Job unsaved successfully' : 'Job saved successfully';
    res.status(200).json({ message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
