import { getConfig } from '@/utils/env';
import { resolveS3AbsoluteUrl } from '@/utils/string';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { omit } from 'lodash';
import mimeTypes from 'mime-types';
import { name as serviceName } from '../../../package.json';
import logger from '../logger';

const s3Client: S3Client = new S3Client({ region: getConfig('AWS_REGION') });

// Upload an image to S3 and returns the absolute image url
export const putObject = async (
  bucket: string,
  key: string,
  image: Buffer,
): Promise<string> => {
  const input: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: image,
    ContentType: <string>mimeTypes.contentType(key),
    ACL: 'public-read',
  };

  logger.debug('s3.PutObjectCommand', {
    data: omit(input, 'Body'),
  });

  const command: PutObjectCommand = new PutObjectCommand(input);

  try {
    await s3Client.send(command);
    return resolveS3AbsoluteUrl(key, serviceName);
  } catch (error) {
    const { name, message } = error;
    logger.error(`s3.PutObjectCommand ${name} ${message}`, {
      data: omit(input, 'Body'),
    });
    throw error;
  }
};
