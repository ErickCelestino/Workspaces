import { GetObjectCommand } from '@aws-sdk/client-s3';
import { FindUrlFileDto, FindUrlFileRepository } from '@workspaces/domain';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { s3Service } from '../../../application';

export class FindUrlFileRepositoryImpl implements FindUrlFileRepository {
  async find(input: FindUrlFileDto): Promise<string> {
    const url = await getSignedUrl(
      s3Service,
      new GetObjectCommand({
        Bucket: process.env['AWS_S3_BUCKET_NAME'],
        Key: input.fileName,
      })
    );
    return url;
  }
}
