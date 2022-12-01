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

const s3Client: S3Client = new S3Client({ region: process.env.region });

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_request_presigner.html
export const getPreSignedPUTUploadUrl = async (
  filename: string,
  folder = '/temp',
): Promise<string> => {
  const Key = `${folder}/${filename}`;
  const input: PutObjectCommandInput = {
    Bucket: getConfig(Config.IMAGE_BUCKET_NAME),
    Key,
    Tagging: 'sem=somethingSemantic', // Adds header { x-amz-tagging: 'sem%3DsomethingSemantic' }
    ACL: 'public-read',
    // User defined Meta data
    Metadata: {
      id: Key, // Adds header { x-amz-meta-id: '12345' }
    },
  };

  const command: PutObjectCommand = new PutObjectCommand(input);
  const signedUrl = await getSignedUrl(s3Client, command, {
    expiresIn: 3600,
  });

  return signedUrl;
};

// https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/modules/_aws_sdk_s3_presigned_post.html
// https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-HTTPPOSTConstructPolicy.html
// https://www.edureka.co/community/21031/public-ish-write-access-to-s3-bucket-with-file-size-limiting
export const getPreSignedPOSTUploadUrl = async (
  filename: string,
  folder = '/temp',
): Promise<PresignedPost> => {
  const Bucket = getConfig(Config.IMAGE_BUCKET_NAME);
  const Key = `${folder}/${filename}`;
  const Conditions: PresignedPostOptions['Conditions'] = [
    { acl: 'public-read' },
    { bucket: Bucket },
    ['content-length-range', 0, 10 * 1024 * 1024],
    // ['starts-with', '$key', 'user/eric/'],
    ['eq', '$key', Key],
  ];
  const Fields = {
    acl: 'public-read',
  };

  const { url, fields }: PresignedPost = await createPresignedPost(s3Client, {
    Bucket,
    Key,
    Conditions,
    Fields,
    Expires: 600, // Seconds before the presigned post expires. 3600 by default.
  });

  return { url, fields };
};
