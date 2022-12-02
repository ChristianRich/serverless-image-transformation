import { getConfig } from './env';

export const resolveS3AbsoluteUrl = (
  key: string,
  serviceName: string,
): string =>
  `https://${serviceName}-${getConfig('NODE_ENV')}-images.s3.${getConfig(
    'AWS_REGION',
  )}.amazonaws.com/${key}`;

export const getFileExtension = (file: string): string =>
  /(?:\.([^.]+))?$/.exec(file)[1];
