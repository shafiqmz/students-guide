import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/database.js";
import morgan from 'morgan';
import { notFound, errorHandler } from './middlewares/error.js';
import userRoutes from './routes/user.js';
import universityRoutes from './routes/university.js';
import jobRoutes from './routes/job.js';
import postRoutes from './routes/post.js';
import analyticsRoutes from './routes/analytics.js';
import classroomRoutes from './routes/classroom.js';
import chatRoutes from './routes/chat.js';
import cors from 'cors';

dotenv.config();
connectDB();
const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}
app.use('/api/user', userRoutes);
app.use('/api/university', universityRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/classroom', classroomRoutes);
app.use('/api/chat', chatRoutes);

app.use(notFound);
app.use(errorHandler);

const port = 4000;
app.listen(
    port,
    console.log(
        `Server running in ${process.env.NODE_ENV} at port ${port}`
    )
);
