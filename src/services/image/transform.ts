import { Input } from '@/types/input';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import { fetchImage } from '../axios/image';
import { getObject } from '../s3/fetch';
import { putObject } from '../s3/upload';
import { applyTransformations } from '../sharp';

export interface OrchestratorOutput {
  s3Url?: string;
  destImage: Buffer;
}

/**
 * Orchestrates the file handling logic based on user input
 */
export const transform = async (
  input: Input,
  headers: APIGatewayProxyEventHeaders,
): Promise<OrchestratorOutput> => {
  const sourceImage: Buffer = await getSource(input, headers);

  const { options } = input;
  const { outputFormat } = options;

  const destImage: Buffer = await applyTransformations(
    outputFormat,
    sourceImage,
    input,
  );

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
