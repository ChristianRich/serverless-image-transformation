import { Config } from '@/constants';
import { getConfig } from './env';

export const resolveS3AbsoluteUrl = (
  key: string,
  bucket: string = getConfig(Config.IMAGE_BUCKET_NAME),
  region: string = getConfig(Config.AWS_REGION),
): string => `https://${bucket}.s3.${region}.amazonaws.com/${key}`;

// https://stackoverflow.com/questions/190852/how-can-i-get-file-extensions-with-javascript
export const getFileExtension = (fn: string): string =>
  fn.split('.').pop().toLowerCase();
