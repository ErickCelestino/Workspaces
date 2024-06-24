import { S3Client } from '@aws-sdk/client-s3';
import * as multerS3 from 'multer-s3';

const s3 = new S3Client({
  region: process.env['AWS_REGION'] ?? '',
  credentials: {
    accessKeyId: process.env['AWS_ACCESS_KEY_ID'] ?? '',
    secretAccessKey: process.env['AWS_SECRET_ACCESS_KEY'] ?? '',
  },
});

export const FileS3Storage = {
  Storage: multerS3({
    s3: s3,
    bucket: process.env['AWS_S3_BUCKET_NAME'] ?? '',
    acl: 'public-read',
    key: (req, file, cb) => {
      const now = new Date();
      cb(null, `${now.getTime()}_${file.originalname}`);
    },
  }),
};
