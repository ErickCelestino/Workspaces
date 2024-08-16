import { Readable } from 'stream';

export function bufferToStream(buffer: Buffer): Readable {
  const readable = new Readable();
  readable.push(buffer);
  readable.push(null); // Indica o fim do stream
  return readable;
}
