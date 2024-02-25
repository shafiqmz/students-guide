import asyncHandler from 'express-async-handler';
import Post from '../models/post.js';
import User from '../models/user.js';
import { uploadToS3 } from '../utils/uploadToS3.js';
import Classroom from './../models/classroom.js';
import { createNotification } from '../utils/createNotification.js';

// Create Post - Route: POST - /api/create-post - PRIVATE - Student, Teacher, Admin

export const createPost = asyncHandler(async (req, res) => {
    const { content, mediaType, university, isAnnouncement, isAssignment, classroomId, assignmentDueDate, assignmentInstructions } = req.body;
    const user = req.user;

    try {
        const isApproved = user.role === 'Admin' || user.role === "Teacher";

        const mediaFiles = req.files['media'];

        let mediaUrls = [];

        if (mediaFiles && mediaFiles.length > 0) {
            for (let i = 0; i < mediaFiles.length; i++) {
                try {
                    const fileExtension = mediaFiles[i].originalname
                        .split('.')
                        .pop();
                    const result = await uploadToS3(
                        mediaFiles[i].buffer,
                        fileExtension
                    );
                    mediaUrls.push(result.Location);
                } catch (err) {
                    return res.status(500).json({
                        message: 'Unable to process Image',
                    });
                }
            }
        }

        const post = await Post.create({
            user: user._id,
            content,
            mediaType,
            mediaUrls,
            isApproved,
            university,
            isAnnouncement: isAnnouncement ? isAnnouncement : false,
            isAssignment: isAssignment ? isAssignment : false,
            classroom: classroomId ? classroomId : null,
            assignmentDueDate: isAssignment ? assignmentDueDate : null,
            assignmentInstructions: isAssignment ? assignmentInstructions : null,
        });

        if (post) {
            const user = await User.findById(req.user._id);

            if (!user) {
                return res.status(404).json({ error: 'User not found' });
            }


            if (!user.posts) {
                user.posts = [];
            }

            user.posts.push(post._id);
            await user.save();

            const senderId = user._id;
            const postId = post._id;

            if ((isAnnouncement && classroomId) || isAssignment) {
                const classroom = await Classroom.findById(classroomId);

                if (classroom) {
                    const studentIds = classroom.students
                        .filter(student => student.isApproved)
                        .map(student => student.user.toString());

                    const filteredStudentIds = studentIds.filter(studentId => studentId !== senderId);
                    const message = isAssignment ? `New assignment in ${classroom.title}` : `New announcement in ${classroom.title}`

                    console.log(message)
                    console.log(classroomId.toString())

                    await Promise.all(filteredStudentIds.map(async (receiverId) => {
                        await createNotification(senderId, receiverId, classroomId.toString(), message, "Classroom Announcement");
                    }));
                }
            }

            if (isAnnouncement && !classroomId) {
                const universityUsers = await User.find({ university: university, _id: { $ne: senderId } });

                await Promise.all(universityUsers.map(async (receiver) => {
                    await createNotification(senderId, receiver._id, postId.toString(), 'New University Announcement!', "University Announcement");
                }));
            }

            if (isApproved) {
                res.status(201).json({ post, message: 'Post created successfully' });
            } else {
                res.status(203).json({ message: "Post sent for verification" })
            }
        } else {
            res.status(400).json({ error: "Couldn't create post" });
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Posts - Route: GET - /api/posts - PRIVATE - Student, Teacher, Admin

export const getPosts = asyncHandler(async (req, res) => {
    const { page, pageSize, isApproved, isAnnouncement, reports } = req.query;
    const skip = (page - 1) * pageSize;
    const user = req.user;

    try {
        const query = {
            isDeleted: false,
            classroom: { $eq: null }
        };

        if (isApproved !== undefined) {
            query.isApproved = isApproved;
        }

        if (isAnnouncement !== undefined) {
            query.isAnnouncement = isAnnouncement;
        }

        query.university = user.university;

        if (reports && reports.toLowerCase() === 'true') {
            query.reports = { $exists: true, $not: { $size: 0 } };
        }

        const posts = await Post.find(query)
            .skip(skip)
            .limit(Number(pageSize))
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                model: 'User',
                select: 'name profilePicture _id roleNumber role',
            })
            .populate({
                path: 'comments.author',
                model: 'User',
                select: 'name profilePicture',
            })
            .populate({
                path: 'likes',
                model: 'User',
                select: '_id name profilePicture',
            })
            .populate({
                path: 'reports.reporterId',
                model: 'User',
                select: 'name profilePicture',
            });


        const formattedPosts = posts.map(post => {
            return ({
                id: post._id,
                authorId: post.user._id,
                authorName: post.user.name,
                authorRole: post.user.role,
                authorRoleNumber: post.user.roleNumber,
                authorImage: post.user.profilePicture,
                content: post.content,
                media: post.mediaUrls,
                mediaType: post.mediaType,
                likes: post.likes.map(like => ({
                    id: like._id,
                    name: like.name
                })),
                comments: post.comments.map(comment => ({
                    author: comment.author.name,
                    authorImage: comment.author.profilePicture,
                    text: comment.text,
                    mediaType: comment.mediaType,
                    media: comment.media
                })),
                reports: post.reports.map(report => ({
                    reporterId: report.reporterId._id,
                    reporterName: report.reporterId.name,
                    reporterImage: report.reporterId.profilePicture,
                    reason: report.reason,
                })),
                saves: post.saves,
                isAnnouncement: post.isAnnouncement,
                createdAt: post.createdAt,
            })
        });

        res.json(formattedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Posts - Route: GET - /api/posts/:postId - PRIVATE - Student, Teacher, Admin

export const getPostById = asyncHandler(async (req, res) => {
    const postId = req.params.postId;
    const user = req.user;

    try {
        const post = await Post.findById(postId)
            .populate({
                path: 'user',
                model: 'User',
                select: 'name profilePicture _id roleNumber role',
            })
            .populate({
                path: 'comments.author',
                model: 'User',
                select: 'name profilePicture',
            })
            .populate({
                path: 'likes',
                model: 'User',
                select: '_id name profilePicture',
            })
            .populate({
                path: 'reports.reporterId',
                model: 'User',
                select: 'name profilePicture',
            });

        if (!post || post.isDeleted) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const formattedPost = {
            id: post._id,
            authorId: post.user._id,
            authorName: post.user.name,
            authorRole: post.user.role,
            authorRoleNumber: post.user.roleNumber,
            authorImage: post.user.profilePicture,
            content: post.content,
            media: post.mediaUrls,
            mediaType: post.mediaType,
            likes: post.likes.map(like => ({
                id: like._id,
                name: like.name
            })),
            comments: post.comments.map(comment => ({
                author: comment.author.name,
                authorImage: comment.author.profilePicture,
                text: comment.text,
                mediaType: comment.mediaType,
                media: comment.media
            })),
            reports: post.reports.map(report => ({
                reporterId: report.reporterId._id,
                reporterName: report.reporterId.name,
                reporterImage: report.reporterId.profilePicture,
                reason: report.reason,
            })),
            saves: post.saves,
            isAnnouncement: post.isAnnouncement,
            createdAt: post.createdAt,
        };

        res.json(formattedPost);
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Posts - Route: GET - /api/posts/classroom/:classroomId - PRIVATE - Student, Teacher

export const getClassroomPostsByClassId = asyncHandler(async (req, res) => {
    const { page, pageSize, isApproved, isAnnouncement, isAssignment } = req.query;
    const skip = (page - 1) * pageSize;
    const { classroomId } = req.params;
    const user = req.user;

    try {
        const query = {
            isDeleted: false,
            classroom: classroomId,
        };

        if (isApproved !== undefined) {
            query.isApproved = isApproved;
        }

        if (isAnnouncement !== undefined) {
            query.isAnnouncement = isAnnouncement;
        }

        if (isAssignment !== undefined) {
            query.isAssignment = isAssignment;
        }

        query.university = user.university;

        const posts = await Post.find(query)
            .skip(skip)
            .limit(Number(pageSize))
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                model: 'User',
                select: 'name profilePicture _id roleNumber role',
            })
            .populate({
                path: 'comments.author',
                model: 'User',
                select: 'name profilePicture',
            })
            .populate({
                path: 'likes',
                model: 'User',
                select: '_id name profilePicture',
            });

        const formattedPosts = posts.map(post => ({
            id: post._id,
            authorId: post.user._id,
            authorName: post.user.name,
            authorRole: post.user.role,
            authorRoleNumber: post.user.roleNumber,
            authorImage: post.user.profilePicture,
            content: post.content,
            classroom: post.classroom,
            media: post.mediaUrls,
            mediaType: post.mediaType,
            likes: post.likes.map(like => ({
                id: like._id,
                name: like.name
            })),
            comments: post.comments.map(comment => ({
                author: comment.author.name,
                authorImage: comment.author.profilePicture,
                text: comment.text,
                mediaType: comment.mediaType,
                media: comment.media
            })),
            saves: post.saves,
            isAnnouncement: post.isAnnouncement,
            isAssignment: post.isAssignment,
            assignmentDueDate: post.assignmentDueDate,
            createdAt: post.createdAt,
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Posts - Route: GET - /api/posts/classroom/:classroomId/:postId - PRIVATE - Student, Teacher

export const getClassroomPostByPostId = asyncHandler(async (req, res) => {
    const { classroomId, postId } = req.params;
    const user = req.user;

    try {
        const classroom = await Classroom.findOne({
            _id: classroomId,
            $or: [
                { teacher: user._id },
                { 'students.user': user._id, 'students.isApproved': true },
            ],
        });

        if (!classroom) {
            return res.status(403).json({ message: 'You are not authorized to view this post' });
        }

        const post = await Post.findOne({
            _id: postId,
            classroom: classroomId,
            isDeleted: false,
        })
        .populate({
            path: 'user',
            model: 'User',
            select: 'name profilePicture _id roleNumber role',
        })
        .populate({
            path: 'comments.author',
            model: 'User',
            select: 'name profilePicture',
        })
        .populate({
            path: 'likes',
            model: 'User',
            select: '_id name profilePicture',
        });

        if (!post || post.isDeleted) {
            return res.status(404).json({ message: 'Post not found' });
        }

        const formattedPost = {
            id: post._id,
            authorId: post.user._id,
            authorName: post.user.name,
            authorRole: post.user.role,
            authorRoleNumber: post.user.roleNumber,
            authorImage: post.user.profilePicture,
            content: post.content,
            media: post.mediaUrls,
            mediaType: post.mediaType,
            likes: post.likes.map(like => ({
                id: like._id,
                name: like.name
            })),
            comments: post.comments.map(comment => ({
                author: comment.author.name,
                authorImage: comment.author.profilePicture,
                text: comment.text,
                mediaType: comment.mediaType,
                media: comment.media
            })),
            saves: post.saves,
            isAnnouncement: post.isAnnouncement,
            isAssignment: post.isAssignment,
            assignmentDueDate: post.assignmentDueDate,
            createdAt: post.createdAt,
        };

        res.json(formattedPost);
    } catch (error) {
        console.error(error);
        if (error.name === 'CastError') {
            return res.status(404).json({ message: 'Post not found' });
        }
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get Posts - Route: GET - /api/posts/saved/post - PRIVATE - Student, Teacher, Admin

export const getSavedPostsById = asyncHandler(async (req, res) => {
    const userId = req.user._id;

    try {
        const query = {
            saves: userId,
            isDeleted: false,
            classroom: { $eq: null }
        };

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                model: 'User',
                select: 'name profilePicture id role roleNumber',
            })
            .populate({
                path: 'comments.author',
                model: 'User',
                select: 'name profilePicture',
            })
            .populate({
                path: 'likes',
                model: 'User',
                select: '_id name profilePicture',
            });

        const formattedPosts = posts.map(post => ({
            id: post._id,
            authorId: post.user._id,
            authorName: post.user.name,
            authorRole: post.user.role,
            authorRoleNumber: post.user.roleNumber,
            authorImage: post.user.profilePicture,
            content: post.content,
            media: post.mediaUrls,
            mediaType: post.mediaType,
            likes: post.likes.map(like => ({
                id: like._id,
                name: like.name,
            })),
            comments: post.comments.map(comment => ({
                author: comment.author.name,
                authorImage: comment.author.profilePicture,
                text: comment.text,
                mediaType: comment.mediaType,
                media: comment.media,
            })),
            saves: post.saves,
            isAnnouncement: post.isAnnouncement,
            createdAt: post.createdAt,
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


// Get User Posts by ID - Route: GET - /api/posts/:userId - PRIVATE - Student, Teacher, Admin

export const getUserPostsById = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    try {
        const query = {
            user: userId,
            isDeleted: false,
            classroom: { $eq: null }
        };

        const posts = await Post.find(query)
            .sort({ createdAt: -1 })
            .populate({
                path: 'user',
                model: 'User',
                select: 'name profilePicture id role roleNumber',
            })
            .populate({
                path: 'comments.author',
                model: 'User',
                select: 'name profilePicture',
            })
            .populate({
                path: 'likes',
                model: 'User',
                select: '_id name profilePicture',
            });

        const formattedPosts = posts.map(post => ({
            id: post._id,
            authorId: post.user._id,
            authorName: post.user.name,
            authorRole: post.user.role,
            authorRoleNumber: post.user.roleNumber,
            authorImage: post.user.profilePicture,
            content: post.content,
            media: post.mediaUrls,
            mediaType: post.mediaType,
            likes: post.likes.map(like => ({
                id: like._id,
                name: like.name,
            })),
            comments: post.comments.map(comment => ({
                author: comment.author.name,
                authorImage: comment.author.profilePicture,
                text: comment.text,
                mediaType: comment.mediaType,
                media: comment.media,
            })),
            saves: post.saves,
            isAnnouncement: post.isAnnouncement,
            createdAt: post.createdAt,
        }));

        res.json(formattedPosts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Like Post - Route: POST - /api/posts/like/:postId - PRIVATE - Student, Teacher, Admin

export const likePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const user = req.user;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const likedIndex = post.likes.indexOf(user._id);

        if (likedIndex !== -1) {
            post.likes.splice(likedIndex, 1);
            await post.save();
            return res.json({ message: 'Post unliked successfully' });
        } else {
            post.likes.push(user._id);
            await post.save();
            if (user._id.toString() !== post.user.toString()) {
                await createNotification(user._id, post.user, postId, `${user.name} liked your post`, 'like');
            }
            return res.json({ message: 'Post liked successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Post Comment - Route: POST - /api/posts/comment/:postId - PRIVATE - Student, Teacher, Admin

export const commentOnPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { text, mediaType } = req.body;
    const user = req.user;

    const attachmentFile =
        req.files['attachment'] && req.files['attachment'][0];

    let mediaUrl = "";

    if (attachmentFile) {
        try {
            const fileExtension = attachmentFile.originalname.split('.').pop();
            const result = await uploadToS3(attachmentFile.buffer, fileExtension);
            mediaUrl = result.Location;
        } catch (err) {
            return res.status(500).json({
                message: 'Unable to process Image',
            });
        }
    }

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const newComment = {
            author: user._id,
            text,
            mediaType,
            media: mediaUrl,
        };

        post.comments.push(newComment);
        await post.save();

        if (user._id.toString() !== post.user.toString()) {
            await createNotification(user._id, post.user, postId, `${user.name} commented on your post`, 'comment');
        }

        res.json({ message: 'Comment added successfully', comment: newComment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Save Post - Route: POST - /api/posts/save/:postId - PRIVATE - Student, Teacher, Admin

export const savePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const user = req.user;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const savedIndex = user.savedPosts.indexOf(post._id);

        if (savedIndex !== -1) {
            user.savedPosts.splice(savedIndex, 1);
            await user.save();

            await Post.findByIdAndUpdate(postId, { $pull: { saves: user._id } });

            return res.json({ message: 'Post unsaved successfully' });
        } else {
            user.savedPosts.push(post._id);
            await user.save();

            post.saves.push(user._id);
            await post.save();

            if (user._id.toString() !== post.user.toString()) {
                await createNotification(user._id, post.user, postId, `${user.name} saved your post`, 'save');
            }

            return res.json({ message: 'Post saved successfully' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Report Post - Route: POST - /api/posts/report/:postId - PRIVATE - Student, Teacher, Admin

export const reportPost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const { reason } = req.body;
    const user = req.user;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        const existingReport = post.reports.find(report => report.reporterId.equals(user._id));

        if (existingReport) {
            return res.status(400).json({ error: 'You have already reported this post' });
        }

        post.reports.push({
            reporterId: user._id,
            reason,
        });

        await post.save();

        const adminUsers = await User.find({ role: 'Admin', university: post.university });

        adminUsers.forEach(admin => {
            createNotification(user._id, admin._id, postId, `${user.name} reported a post`, "report");
        });

        res.json({ message: 'Post reported successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Ignore All Reports - Route: put - /api/posts/ignore-reports/:postId - PRIVATE - Admin

export const ignoreAllReports = asyncHandler(async (req, res) => {
    const { postId } = req.params;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.isDeleted) {
            return res.status(400).json({ error: 'Post is deleted and reports cannot be ignored' });
        }

        post.reports = [];

        await post.save();

        return res.json({ message: 'All reports ignored successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Soft Delete Post - Route: DELETE - /api/posts/delete/:postId - PRIVATE - Admin

export const deletePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const user = req.user;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.isDeleted) {
            return res.status(400).json({ error: 'Post is already deleted' });
        }

        post.isDeleted = true;

        await post.save();

        await createNotification(user._id, post.user, postId, `Admin deleted your post`, 'delete');

        return res.json({ message: 'Post deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Approve Post - Route: put - /api/posts/approve/:postId - PRIVATE - Admin

export const approvePost = asyncHandler(async (req, res) => {
    const { postId } = req.params;
    const user = req.user;

    try {
        const post = await Post.findById(postId);

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        if (post.isDeleted) {
            return res.status(400).json({ error: 'Post is deleted and cannot be approved' });
        }

        if (post.isApproved) {
            return res.status(401).json({ error: 'Post is already approved' });
        }

        post.isApproved = true;

        await post.save();

        await createNotification(user._id, post.user, postId, `Your post has been approved`, 'approve');
        return res.json({ message: 'Post approved successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
