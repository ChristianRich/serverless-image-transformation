import type {
  ValidatedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@/types/api-gateway';
import { middyfyWithRequestBody } from '@/middleware';
import { transform, OrchestratorOutput } from '@/services/image/transform';
import logger from '@/services/logger';
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

  // Return the bitmap to the caller in the response body
  if (destination.http && output.destImage) {
    return {
      statusCode: 200,
      headers: {
        'Content-Type': `image/${options.outputFormat}`, // TODO Something's wrong here, "jpeg" works but "jpg" does not?
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
