import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3,
} from '@aws-sdk/client-s3';
import { UploadFileDto, UploadFileRepository } from '@workspaces/domain';
import { s3Service } from '../../../application';

export class UploadFileRepositoryImpl implements UploadFileRepository {
  async upload(input: UploadFileDto): Promise<void> {
    const { file } = input;

    for (const item of file) {
      const now = new Date();
      const uploadParams: PutObjectCommandInput = {
        Bucket: process.env['AWS_S3_BUCKET_NAME'],
        Key: `${now.getTime()}_${item.originalname.replace(/\s+/g, '-')}`,
        Body: item.buffer,
        ContentType: item.mimetype,
        ACL: 'public-read',
      };

      const command = new PutObjectCommand(uploadParams);
      const result = await s3Service.send(command);
      console.log(result);
    }
  }
}
