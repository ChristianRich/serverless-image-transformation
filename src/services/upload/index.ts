import { Config } from '@/constants';
import { S3Bucket } from '@/types/input';
import { getConfig } from '@/utils/env';
import { resolveS3AbsoluteUrl } from '@/utils/string';
import { v4 } from 'uuid';
import { name as serviceName } from '../../../package.json';
import { getPresignedFormUrl, getPreSignedUrl } from '../s3/pre-sign';

export interface PresignedUploadUrl {
  uploadUrl: string;
  s3Url: string;
  fields?: Record<string, string>;
}

export const resolvePresignedUrl = async (
  type: string,
  s3?: S3Bucket,
): Promise<PresignedUploadUrl> => {
  const {
    bucket = getConfig(Config.IMAGE_BUCKET_NAME),
    key = v4().replace(/-/g, ''),
  } = s3;

  // Swap wildcard in key with UUID
  const autoKey = key.replace(/\*/, v4().replace(/-/g, ''));
  const result: Partial<PresignedUploadUrl> = {
    s3Url: resolveS3AbsoluteUrl(autoKey, serviceName),
  };

  if (type === 's2s') {
    result.uploadUrl = await getPreSignedUrl(bucket, autoKey);
  } else {
    const { fields, url }: PresignedPost = await getPresignedFormUrl(
      bucket,
      autoKey,
    );
    result.fields = fields;
    result.uploadUrl = url;
  }

  return <PresignedUploadUrl>result;
};

export interface PresignedPost {
  url: string;
  fields: Record<string, string>;
}
