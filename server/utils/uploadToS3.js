import AWS from "aws-sdk";
import multer from "multer";

const awsConfig = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.REGION,
}


const S3 = new AWS.S3(awsConfig)

export const uploadToS3 = (fileData, fileExtension) => {
    return new Promise((resolve, reject) => {
        const key = `${Date.now().toString()}.${fileExtension}`;

        const params = {
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: key, 
            Body: fileData
        }

        S3.upload(params, (err, data) => {
            if (err) {
                reject(err);
            }

            return resolve(data)
        })
    })
}