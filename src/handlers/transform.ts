import type {
  ValidatedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@/types/api-gateway';
import { middyfyWithRequestBody } from '@/middleware';
import { transform, OrchestratorOutput } from '@/services/image/transform';
import logger from '@/services/logger';
import mimeTypes from 'mime-types';
import { Input, requestBodyValidationSchema } from '../types/input';

const baseHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof requestBodyValidationSchema
> = async (
  event: ValidatedAPIGatewayProxyEvent<typeof requestBodyValidationSchema>,
) => {
  const { body, headers } = event;
  const input: Input = <Input>body;
  const { options, destination } = input;

  logger.debug('Image transformation request received', { data: input });
  const output: OrchestratorOutput = await transform(input, headers);

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
