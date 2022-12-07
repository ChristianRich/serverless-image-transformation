/* eslint-disable lines-between-class-members */
export class Config {
  static readonly IMAGE_BUCKET_NAME = 'IMAGE_BUCKET_NAME';
  static readonly AWS_REGION = 'AWS_REGION';
  static readonly NODE_ENV = 'NODE_ENV'; // derived from Serverless config `sls.stage`
  static readonly FILE_SIZE_POST_UPLOAD_LIMIT_MB =
    'FILE_SIZE_POST_UPLOAD_LIMIT_MB';
}
