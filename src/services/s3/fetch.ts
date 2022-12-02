import { getConfig } from '@/utils/env';
import {
  S3Client,
  GetObjectCommandInput,
  GetObjectCommand,
  GetObjectCommandOutput,
} from '@aws-sdk/client-s3';
import { Readable } from 'stream';
import logger from '../logger';

const s3Client: S3Client = new S3Client({ region: getConfig('AWS_REGION') });

export const getObject = async (
  bucket: string,
  key: string,
): Promise<Buffer> => {
  const input: GetObjectCommandInput = {
    Bucket: bucket,
    Key: key,
  };

  const command: GetObjectCommand = new GetObjectCommand(input);
  const response: GetObjectCommandOutput = await s3Client.send(command);
  logger.debug(`Loaded source image from ${JSON.stringify(input, null, 2)}`);
  return streamToBuffer(response);
};

const streamToBuffer = async (
  response: GetObjectCommandOutput,
): Promise<Buffer> => {
  const stream: Readable = response.Body;
  const chunks: Buffer[] = [];
  return new Promise((resolve, reject) => {
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', (err) => reject(err));
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
};
