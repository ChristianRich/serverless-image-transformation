import { getSource } from '@/services/image/transform';
import logger from '@/services/logger';
import { getMetadata } from '@/services/sharp/meta-data';
import { Input } from '@/types/input';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import { set } from 'lodash';
import { Metadata } from 'sharp';

// Formatting image transformation input options
// Decorates with default values and populates the internal state
export const setDefaultOptions = async (
  input: Input,
  headers: APIGatewayProxyEventHeaders,
): Promise<Input> => {
  // Clone
  const result: Input = Object.assign(input, {});

  // Load the source image and pin to the `input` object's internal state
  set(result, 'internal.source', await getSource(result, headers));

  // If a destination was not provided default to HTTP delivery
  if (!result.destination) {
    set(result, 'destination.http', true);
  }

  // When `outputFormat` was not provided resolve from the source image
  if (!result?.options?.outputFormat) {
    const { format }: Metadata = await getMetadata(result.internal.source);
    set(result, 'options.outputFormat', format);
    logger.debug(`Resolving outputFormat to '${format}'`);
  }

  if (result.destination?.s3.key) {
    const { key } = result?.destination?.s3;
    const s3Key = `${key}.${input.options.outputFormat}`;
    set(result, 'destination.s3.key', s3Key);
  }

  return result;
};
