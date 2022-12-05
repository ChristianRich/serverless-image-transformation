import type {
  ValidatedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@/types/api-gateway';
import { middyfyWithRequestBody } from '@/middleware';
import {
  transform,
  OrchestratorOutput,
  getSource,
} from '@/services/image/transform';
import logger from '@/services/logger';
import mimeTypes from 'mime-types';
import { set } from 'lodash';
import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import { getMetadata } from '@/services/sharp/meta-data';
import { Metadata } from 'sharp';
import { Input, requestBodyValidationSchema } from '../types/input';

const baseHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof requestBodyValidationSchema
> = async (
  event: ValidatedAPIGatewayProxyEvent<typeof requestBodyValidationSchema>,
) => {
  const { body, headers } = event;
  logger.debug('Image transformation request received', { data: body });

  const input: Input = <Input>body;
  await setDefaultOptions(input, headers);

  const { options, destination } = input;
  const output: OrchestratorOutput = await transform(input);

  if (destination.http && output.destImage) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': mimeTypes.lookup(options.outputFormat),
      },
      body: output.destImage.toString('base64'),
      isBase64Encoded: true,
    };
  }

  // Return the S3 url
  return {
    statusCode: 200,
    body: JSON.stringify({ url: output.s3Url }),
  };
};

export const handler = middyfyWithRequestBody(
  baseHandler,
  requestBodyValidationSchema,
);

export const setDefaultOptions = async (
  input: Input,
  headers: APIGatewayProxyEventHeaders,
): Promise<void> => {
  set(input, 'internal.source', await getSource(input, headers));

  // If a destination was not supplied default to HTTP delivery
  if (!input.destination) {
    set(input, 'destination.http', true);
  }

  if (!input?.options?.outputFormat) {
    const { format }: Metadata = await getMetadata(input.internal.source);
    set(input, 'options.outputFormat', format);
  }
};
