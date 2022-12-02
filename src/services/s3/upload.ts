import { getConfig } from '@/utils/env';
import { resolveS3AbsoluteUrl } from '@/utils/string';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { omit } from 'lodash';
import { name as serviceName } from '../../../package.json';
import logger from '../logger';

const s3Client: S3Client = new S3Client({ region: getConfig('AWS_REGION') });

export const putObject = async (
  bucket: string,
  key: string,
  image: Buffer,
): Promise<string> => {
  const ext = key.substring(key.lastIndexOf('.') + 1);
  const input: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    Body: image,
    ContentType: `image/${ext.toLowerCase()}`,
    ACL: 'public-read',
  };

  const command: PutObjectCommand = new PutObjectCommand(input);
  await s3Client.send(command);
  logger.debug('Image uploaded to S3', {
    data: omit(input, 'Body'),
  });
  return resolveS3AbsoluteUrl(key, serviceName);
};
