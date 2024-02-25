import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/user.js';

export const protect = asyncHandler(async (req, res, next) => {
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        try {
            token = req.headers.authorization.split(' ')[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id);
            next();
        } catch (error) {
            console.error(error);
            res.status(401);
            throw new Error('Not authorized');
        }
    }

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const authorizationError = (res, message) => {
    res.status(401);
    throw new Error(message);
};

export const isStudent = (req, res, next) => {
    if (req.user && (req.user.role === "Student")) {
        next();
    } else {
        authorizationError(res, 'Only student can access this route');
    }
};

export const isTeacher = (req, res, next) => {
    if (req.user && (req.user.role === "Teacher")) {
        next();
    } else {
        authorizationError(res, 'Only teachers can access this route');
    }
};

export const isAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "Admin")) {
        next();
    } else {
        authorizationError(res, 'Only admins can access this route');
    }
};

export const isSuperAdmin = (req, res, next) => {
    if (req.user && req.user.role === "Superadmin") {
        next();
    } else {
        authorizationError(res, 'Only superadmins can access this route');
    }
};

export const isTeacherOrAdminOrSuperAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "Teacher" || req.user.role === "Admin" || req.user.role === "Superadmin")) {
        next();
    } else {
        authorizationError(res, 'Only teachers, admins, and superadmins can access this route');
    }
};

export const isAdminOrSuperAdmin = (req, res, next) => {
    if (req.user && (req.user.role === "Admin" || req.user.role === "Superadmin")) {
        next();
    } else {
        authorizationError(res, 'Only admins and superadmins can access this route');
    }
}



