import type { HttpError } from 'http-errors';
import { middyfy } from '@/middleware';
import { fetchImage } from '@/services/axios/image';
import logger from '@/services/logger';
import { getMetadata } from '@/services/sharp/meta-data';
import {
  APIGatewayProxyEvent,
  APIGatewayProxyHandler,
  APIGatewayProxyResult,
} from 'aws-lambda';
import { Metadata } from 'sharp';

const baseHandler: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> => {
  const { queryStringParameters, headers } = event;
  const { url } = queryStringParameters;

  const image: Buffer = await fetchImage(url, [], headers);
  const metaData: Metadata = await getMetadata(image);

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(metaData),
    };
  } catch (error) {
    const { name, message, statusCode = 500 } = <Error | HttpError>error;

    logger.error(`User getting image meta-data ${name} ${message}`, {
      data: { url },
    });

    return {
      statusCode,
      body: JSON.stringify({ name, message, statusCode }),
    };
  }
};

export const handler = middyfy(baseHandler);
