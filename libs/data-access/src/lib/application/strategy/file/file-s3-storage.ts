import multerS3 from 'multer-s3';
import { s3Service } from '../../services';
const uploadedFileNames: string[] = [];

const storage = multerS3({
  s3: s3Service,
  bucket: process.env['AWS_S3_BUCKET_NAME'] ?? '',
  key: (
    req: unknown,
    file: Express.Multer.File,
    cb: (error: unknown, key?: string) => void
  ) => {
    const now = new Date();
    const fileName = `${now.getTime()}_${file.originalname.replace(
      /\s+/g,
      '-'
    )}`;

    uploadedFileNames.push(fileName);
    cb(null, fileName);
  },
});

export const FileS3Storage = {
  Storage: storage,
  getUploadedFileNames: () => {
    const names = [...uploadedFileNames];
    uploadedFileNames.length = 0;
    return names;
  },
};
