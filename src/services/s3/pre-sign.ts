/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Config } from '@/constants';
import { getConfig } from '@/utils/env';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  createPresignedPost,
  PresignedPost,
  PresignedPostOptions,
} from '@aws-sdk/s3-presigned-post';

const s3Client: S3Client = new S3Client({ region: getConfig('AWS_REGION') });

/**
 * Generates pre-signed S3 upload url
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html
 * @param {string} bucket
 * @param {string} key
 * @returns {PresignedPost} POST URL and a collection of form fields
 */
export const getPreSignedUrl = async (
  bucket: string,
  key: string,
): Promise<string> => {
  const input: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    ACL: 'public-read',
  };

  const command: PutObjectCommand = new PutObjectCommand(input);
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return signedUrl;
};

/**
 * Generates pre-signed S3 upload url suitable for use in a multipart/form-data HTML form
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_presigned_post.html
 * https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
 * @param {string} filename
 * @param {string} folder
 * @param {fileSizeLimitMb} fileSizeLimitMb Upload file size restriction in mega bytes (mB)
 * @returns {PresignedPost} POST URL including a collection of form fields
 */
export const getPresignedFormUrl = async (
  bucket: string,
  key: string,
  fileSizeLimitMb = Config.FILE_SIZE_UPLOAD_LIMIT_MB,
): Promise<PresignedPost> => {
  const Key = key;
  const Conditions: PresignedPostOptions['Conditions'] = [
    { acl: 'public-read' },
    { bucket },
    ['content-length-range', 0, fileSizeLimitMb * 1024 * 1024],
    ['eq', '$key', Key],
  ];
  const Fields: Record<string, string> = {
    acl: 'public-read',
  };
  return createPresignedPost(s3Client, {
    Bucket: bucket,
    Key,
    Conditions,
    Fields,
    Expires: 3600,
  });
};
