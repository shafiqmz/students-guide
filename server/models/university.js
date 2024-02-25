import mongoose from 'mongoose';

const universitySchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please enter university name'],
    trim: true,
  },
  domainEmail: {
    type: String,
    required: [true, 'Please enter university domain email'],
  },
  province: {
    type: String,
    required: [true, 'Please enter the province name of the university'],
  },
  representativeName: {
    type: String,
    required: [true, 'Please enter university representative name'],
  },
  representativeEmail: {
    type: String,
    required: [true, 'Please enter university representative email'],
  },
  universityImages: [
    {
      type: String,
    },
  ],
  hecLicenseImage: {
    type: String,
    required: [true, 'Need HEC License image.'],
  },
  websiteUrl: {
    type: String,
    required: [true, 'Please enter university website url'],
  },
  isApproved: {
    type: Boolean,
    default: false,
  },
  admins: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  teachers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  students: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Post',
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const University = mongoose.model('University', universitySchema);
export default University;
