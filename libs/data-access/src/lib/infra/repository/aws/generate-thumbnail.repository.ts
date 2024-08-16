import ffmpeg from 'fluent-ffmpeg';
import ffmpegInstaller from '@ffmpeg-installer/ffmpeg';
import { PassThrough } from 'stream';
import {
  GenerateThumbnailDto,
  GenerateThumbnailRepository,
} from '@workspaces/domain';

export class GenerateThumbnailRepositoryImpl
  implements GenerateThumbnailRepository
{
  async generate(input: GenerateThumbnailDto): Promise<Buffer> {
    ffmpeg.setFfmpegPath(ffmpegInstaller.path);
    return new Promise((resolve, reject) => {
      const thumbnailStream = new PassThrough();
      const buffers: Buffer[] = [];

      thumbnailStream.on('data', (chunk) => buffers.push(chunk));
      thumbnailStream.on('end', () => resolve(Buffer.concat(buffers)));
      thumbnailStream.on('error', (err) => reject(err));
      const emptyReturn = {};
      ffmpeg()
        .input(input.file)
        .on('end', () => emptyReturn)
        .on('error', (err) => reject(err))
        .screenshots({
          count: 1,
          timestamps: ['0'],
          folder: '/tmp',
          filename: input.key,
          size: '320x240',
        })
        .pipe(thumbnailStream, { end: true });
    });
  }
}
