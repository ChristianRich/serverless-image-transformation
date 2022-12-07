import type { HttpError } from 'http-errors';
import { middyfyWithRequestBody } from '@/middleware';
import { resolvePresignedUrl } from '@/services/upload';
import { requestBodyValidationSchema } from '@/types/input';
import logger from '@/services/logger';
import { PresignedUploadUrl, PresignedUrlType } from '@/types';
import {
  APIGatewayProxyHandler,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';

const baseHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { body, pathParameters } = event;
  const { type, filename } = pathParameters;

  try {
    const result: PresignedUploadUrl = await resolvePresignedUrl(
      <PresignedUrlType>type,
      filename,
    );

    return {
      statusCode: 200,
      body: JSON.stringify(result),
    };
  } catch (error) {
    const { name, message, statusCode = 500 } = <Error | HttpError>error;

    logger.error(`User getting pre-signed URL ${name} ${message}`, {
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
