import mongoose from 'mongoose';

const classroomSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please enter your class title'],
    trim: true,
  },
  description: {
    type: String,
  },
  classCode: {
    type: String,
    required: [true, 'Classcode not sent']
  },
  university: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
  },
  students: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      isApproved: {
        type: Boolean,
        default: false,
      },
    },
  ],
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
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

const Classroom = mongoose.model('Classroom', classroomSchema);
export default Classroom;
