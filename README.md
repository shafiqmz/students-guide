# Students Guide Platform

The Students Guide platform is a comprehensive solution designed to enhance the educational experience for students, teachers, and administrators. It offers a range of functionalities focused on classroom management, job finding, and course recommendations based on YouTube content. The platform is structured to support four primary roles: Student, Teacher, Admin, and Superadmin, each with distinct capabilities and access levels to various features.

## FYP UI Folder

Within the repository, there's a folder named `FYP UI` that contains the overall flow of the website. This directory is structured to provide a clear and intuitive understanding of the website's design, layout, and functionality. The `FYP UI` folder is designed to serve as a comprehensive guide through the user interface and experience aspects of the Students Guide platform.

## Live Application

Access the live version of the Students Guide platform at [students-guide.vercel.app](https://students-guide.vercel.app).

## Features

### Superadmin

- **CRUD Operations**: Manage users and universities.
- **Dashboard**:
  - Display counts of users and universities.
  - Show roles (Admin & Student/Teacher).
  - Visualize top universities by student count and post count using Bar Charts.
  - Overview of total jobs posted.
  
### Admin

- **University Management**: Perform CRUD operations for students/teachers within universities.
- **Post Filtering**: Manage and filter posts across the platform.
- **Announcements & Alerts**: Ability to declare announcements and create alerts for all university students.
- **Job Announcements**: Publish job opportunities accessible to all platform users.

### Teacher

- **Classroom Management**: Create and manage classrooms, including approval of student posts.
- **Announcements**: Make classroom-specific announcements, assign tasks with due dates.
- **Post Creation**: Publish posts for all university students without admin approval.
- **Alerts**: Generate alerts for all students in a classroom.
- **Job Announcements**: Post job opportunities accessible to all platform users.

### Student

- **Post Submission**: Submit posts for approval by admin (public posts) or teacher (classroom posts).
- **Communication**: Message university teachers directly.
- **Course Recommendations**: Receive course suggestions based on provided interests, sourced from YouTube.
- **Assignment Submissions**: Submit assignments for classroom tasks.
- **Interaction**: Like and comment on posts.
- **Job Announcements**: Post job opportunities accessible to all platform users.

## Theme

The platform is themed around **Classroom Management**, **Job Finding**, and finding **Courses Related to Their Interests** from YouTube, aiming to provide a holistic educational ecosystem for its users.

## Tech Stack

- **Frontend**: Next.js, Tailwind CSS, Material-UI (MUI)
- **Backend**: Node.js with Express.js
- **Database**: MongoDB
- **Real-time Communication**: Socket.io
- **File Storage**: AWS S3 Bucket for uploading files
- **Email Service**: Nodemailer with SMTP from Gmail for notifications and alerts
- **External APIs**: YouTube API for fetching course recommendations, g2plot for data visualization

## Default Credentials

- **Superadmin Email**: labesh@superadmin.com
- **Password**: Labesh@123