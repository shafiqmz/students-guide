import mongoose from 'mongoose';

const commentSchema = mongoose.Schema({
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
    },
    mediaType: {
        type: String,
    },
    media: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const postSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    content: {
        type: String,
    },
    mediaType: {
        type: String,
    },
    mediaUrls: [{
        type: String,
    }],
    isApproved: {
        type: Boolean,
        default: false,
    },
    university: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
        required: true,
    },
    isAnnouncement: {
        type: Boolean,
        default: false,
    },
    classroom: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Classroom',
        default: null,  
    },
    isAssignment: {
        type: Boolean,
        default: false,
    },
    assignmentDueDate: {
        type: Date,
    },
    assignmentInstructions: String,
    likes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    comments: [commentSchema],
    saves: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }],
    reports: [{
        reporterId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        reason: String
    }],
    isDeleted: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Post = mongoose.model('Post', postSchema);
export default Post;
