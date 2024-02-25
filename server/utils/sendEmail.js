import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import dotenv from 'dotenv';
dotenv.config();

const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.REDIRECT_URI
);

oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN
});

const sendEmail = async (to, subject, text) => {
    const ACCESS_TOKEN = await oauth2Client.getAccessToken();
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            type: 'OAuth2',
            user: process.env.ID_EMAIL,
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
            accessToken: ACCESS_TOKEN,
        },
    });

    try {
        const mailOptions = {
            from: process.env.ID_EMAIL,
            to,
            subject,
            text,
        };
        transporter.sendMail(mailOptions, (err, result) => {
            if (err) {
                throw new Error('Error sending email');
            }
            transporter.close();
        });
    } catch (error) {
        throw new Error('Error sending email');
    }
};

export default sendEmail;
