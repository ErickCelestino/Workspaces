import multerS3 from 'multer-s3';
import { s3Service } from '../../services';
import { FileNotAllowed, FileTypes } from '@workspaces/domain';
import multer from 'multer';
import { Request } from 'express';
import { ParamsDictionary } from 'express-serve-static-core';
import { ParsedQs } from 'qs';
import { BadRequestException } from '@nestjs/common';
const uploadedFileNames: string[] = [];

const storage = multerS3({
  s3: s3Service,
  bucket: process.env['AWS_S3_BUCKET_NAME'] ?? '',
  key: (
    req: Request<ParamsDictionary, unknown, unknown, ParsedQs>,
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

const fileFilter = (
  req: Request<ParamsDictionary, unknown, unknown, ParsedQs>,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (FileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const error = new FileNotAllowed();
    cb(
      new BadRequestException({
        error: {
          name: error.name,
          message: error.message,
        },
      })
    );
  }
};

export const FileS3Storage = {
  Storage: storage,
  getUploadedFileNames: () => {
    const names = [...uploadedFileNames];
    uploadedFileNames.length = 0;
    return names;
  },
  fileFilter: fileFilter,
};
