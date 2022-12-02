import { middyfyWithRequestBody } from '@/middleware';
import {
  ValidatedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@/types/api-gateway';
import { resolvePresignedUrl } from '@/services/upload';

export const requestBodyValidationSchema = {
  type: 'object',
  properties: {
    s3: {
      type: 'object',
      properties: {
        bucket: { type: 'string' },
        key: { type: 'string' },
      },
    },
  },
  additionalProperties: false,
} as const;

const baseHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof requestBodyValidationSchema
> = async (
  event: ValidatedAPIGatewayProxyEvent<typeof requestBodyValidationSchema>,
) => {
  const { body, pathParameters } = event;
  const { s3 = {} } = body || {};
  const { type } = pathParameters;

  try {
    const res = await resolvePresignedUrl(type, s3);
    return {
      statusCode: 200,
      body: JSON.stringify({ ...res }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const handler = middyfyWithRequestBody(
  baseHandler,
  requestBodyValidationSchema,
);
