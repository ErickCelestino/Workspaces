import multerS3 from 'multer-s3';
import { s3Service } from '../../services';

const storage = multerS3({
  s3: s3Service,
  bucket: process.env['AWS_S3_BUCKET_NAME'] ?? '',
  acl: 'public-read',
  key: (
    req: any,
    file: Express.Multer.File,
    cb: (error: any, key?: string) => void
  ) => {
    const now = new Date();
    cb(null, `${now.getTime()}_${file.originalname.replace(/\s+/g, '-')}`);
  },
});

export const FileS3Storage = {
  Storage: storage,
};
