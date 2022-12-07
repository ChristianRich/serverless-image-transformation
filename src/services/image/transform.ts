import { Input } from '@/types/input';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import { fetchImage } from '../axios/image';
import { getObject } from '../s3/fetch';
import { putObject } from '../s3/upload';
import { applyTransformations } from '../sharp/transform';

export interface OrchestratorOutput {
  s3Url?: string;
  destImage: Buffer; // Image processing result
}

/**
 * Orchestrates the file handling logic from API input options
 */
export const transform = async (input: Input): Promise<OrchestratorOutput> => {
  const destImage: Buffer = await applyTransformations(input);
  const s3Url: string | undefined = await putDestination(input, destImage);

  return {
    s3Url,
    destImage,
  };
};

export const getSource = async (
  input: Input,
  headers: APIGatewayProxyEventHeaders,
): Promise<Buffer> => {
  const { source } = input;

  if (source.http) {
    const { url, forwardHeaders = [] } = source.http;
    return fetchImage(url, forwardHeaders, headers);
  }

  const { bucket, key } = source.s3;
  return getObject(bucket, key);
};

export const putDestination = async (
  input: Input,
  image: Buffer,
): Promise<string | undefined> => {
  const { destination } = input;

  if (destination.s3) {
    const { bucket, key } = destination.s3;
    return putObject(bucket, key, image);
  }

  return undefined;
};
