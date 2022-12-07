import type {
  ValidatedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@/types/api-gateway';
import { middyfyWithRequestBody } from '@/middleware';
import { transform, OrchestratorOutput } from '@/services/image/transform';
import logger from '@/services/logger';
import mimeTypes from 'mime-types';
import { setDefaultOptions } from '@/utils/options';
import { Input, requestBodyValidationSchema } from '../types/input';

const baseHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof requestBodyValidationSchema
> = async (
  event: ValidatedAPIGatewayProxyEvent<typeof requestBodyValidationSchema>,
) => {
  const { body, headers } = event;
  logger.debug('Async image transformation request received', { data: body });

  const input: Input = await setDefaultOptions(<Input>body, headers);
  const { options, destination } = input;
  const output: OrchestratorOutput = await transform(input);

  if (destination.http) {
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
