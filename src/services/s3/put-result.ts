import { Config } from '@/constants';
import { getConfig } from '@/utils/env';
import {
  S3Client,
  PutObjectCommand,
  PutObjectCommandInput,
} from '@aws-sdk/client-s3';

const s3Client: S3Client = new S3Client({ region: process.env.region });

export const uploadResult = async (
  filename: string,
  folder = '/temp',
): Promise<string> => {
  const Key = `${folder}/${filename}`;
  const input: PutObjectCommandInput = {
    Bucket: getConfig(Config.IMAGE_BUCKET_NAME),
    Key,
    Tagging: 'status=complete',
    ACL: 'public-read',
    Metadata: {
      id: Key, // Adds header { x-amz-meta-id: '12345' }
      status: 'COMPLETE',
    },
  };

  const command: PutObjectCommand = new PutObjectCommand(input);
  // TODO
};
