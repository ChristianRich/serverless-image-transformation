import { Config } from '@/constants';
import { PresignedPost, PresignedUploadUrl, PresignedUrlType } from '@/types/';
import { getConfig } from '@/utils/env';
import { v4 } from 'uuid';
import createHttpError from 'http-errors';
import { resolveS3AbsoluteUrl } from '@/utils/string';
import { getPresignedFormUrl, getPreSignedUrl } from '../s3/pre-sign';

export const resolvePresignedUrl = async (
  type: PresignedUrlType,
  key: string,
): Promise<PresignedUploadUrl> => {
  const bucket = getConfig(Config.IMAGE_BUCKET_NAME);

  // Swap wildcard in key with UUID
  const autoKey = key.replace(/\*/, v4().replace(/-/g, ''));

  // Return the future URL of the S3 image prior to upload (where the image will eventually become available)
  const result: Partial<PresignedUploadUrl> = {
    s3Url: resolveS3AbsoluteUrl(autoKey),
  };

  if (type === 's2s') {
    result.uploadUrl = await getPreSignedUrl(bucket, autoKey);
  } else if (type === 'form') {
    const { fields, url }: PresignedPost = await getPresignedFormUrl(
      bucket,
      autoKey,
    );
    result.fields = fields;
    result.uploadUrl = url;
  } else {
    throw createHttpError(
      400,
      `Unsuported pre-signed URL type "${type}". Supported types are "s2s" and "form"`,
    );
  }

  return <PresignedUploadUrl>result;
};
