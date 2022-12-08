import type { HttpError } from 'http-errors';
import type {
  ValidatedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@/types/api-gateway';
import { middyfyWithRequestBody } from '@/middleware';
import { transform } from '@/services/image/transform';
import logger from '@/services/logger';
import { resolveS3AbsoluteUrl } from '@/utils/string';
import { setDefaultOptions } from '@/utils/options';
import { Input, requestBodyValidationSchema } from '../types/input';

const baseHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof requestBodyValidationSchema
> = async (
  event: ValidatedAPIGatewayProxyEvent<typeof requestBodyValidationSchema>,
) => {
  const { body, headers } = event;
  logger.debug('Sync image transformation request received', { data: body });

  try {
    const input: Input = await setDefaultOptions(<Input>body, headers);

    // Synchronous invocation aka "fire & forget"
    // eslint-disable-next-line no-void
    void transform(input);

    // Return the computed S3 url immediately
    return {
      statusCode: 200,
      body: JSON.stringify({
        url: resolveS3AbsoluteUrl(input.destination.s3.key),
      }),
    };
  } catch (error) {
    const { name, message, statusCode = 500 } = <Error | HttpError>error;

    logger.error(`Error during async image operation ${name} ${message}`, {
      data: { body },
    });

    return {
      statusCode,
      body: JSON.stringify({ name, message, statusCode }),
    };
  }
};

export const handler = middyfyWithRequestBody(
  baseHandler,
  requestBodyValidationSchema,
);
