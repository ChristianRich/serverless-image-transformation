export interface PresignedUploadUrl {
  uploadUrl: string;
  fields?: Record<string, string>;
  s3Url?: string;
}

export interface PresignedPost {
  url: string;
  fields: Record<string, string>;
}

export type PresignedUrlType = 's2s' | 'form';
