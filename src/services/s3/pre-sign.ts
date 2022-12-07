/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Config } from '@/constants';
import { getConfig } from '@/utils/env';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
  StorageClass,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import {
  createPresignedPost,
  PresignedPost,
  PresignedPostOptions,
} from '@aws-sdk/s3-presigned-post';
import logger from '../logger';

const s3Client: S3Client = new S3Client({ region: getConfig('AWS_REGION') });

// TODO Change to GET and accecept key in URL
// GET http://localhost:3000/dev/url/s2s/sutterpik.jpg

/**
 * Generates pre-signed S3 upload url
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html
 * @param {string} bucket
 * @param {string} key
 * @returns {PresignedPost} POST URL and a collection of form fields
 */
export const getPreSignedUrl = async (
  bucket: string,
  key: string | undefined,
): Promise<string> => {
  const input: PutObjectCommandInput = {
    Bucket: bucket,
    Key: key,
    ACL: 'public-read',
    ContentEncoding: 'image/jpeg', // TODO use .ext in url provided in call
    ContentType: 'xxx', // TODO use the mimedude.getContentType('jpg') from user input
    // https://docs.aws.amazon.com/AmazonS3/latest/userguide/storage-class-intro.html
    StorageClass: StorageClass.INTELLIGENT_TIERING,
  };

  const command: PutObjectCommand = new PutObjectCommand(input);

  try {
    logger.debug('s3.getSignedUrl', { data: { input } });
    const signedUrl = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return signedUrl;
  } catch (error) {
    const { name, message } = error;
    logger.error(`s3.PutObjectCommand ${name} ${message}`, {
      data: input,
    });
    throw error;
  }
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
  fileSizeLimitMb = getConfig(Config.FILE_SIZE_POST_UPLOAD_LIMIT_MB),
): Promise<PresignedPost> => {
  const Key = key;
  const Conditions: PresignedPostOptions['Conditions'] = [
    { acl: 'public-read' },
    { bucket },
    ['content-length-range', 0, Number(fileSizeLimitMb) * 1024 * 1024],
    ['eq', '$key', Key],
  ];
  const Fields: Record<string, string> = {
    acl: 'public-read',
  };
  const input: PresignedPostOptions = {
    Bucket: bucket,
    Key,
    Conditions,
    Fields,
    Expires: 3600,
  };
  try {
    logger.debug('s3.createPresignedPost', { data: { input } });
    const result: PresignedPost = await createPresignedPost(s3Client, input);
    return result;
  } catch (error) {
    const { name, message } = error;
    logger.error(`s3.createPresignedPost ${name} ${message}`, {
      data: input,
    });
    throw error;
  }
};
