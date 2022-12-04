import { middyfy } from '@/middleware';
import { fetchImage } from '@/services/axios/image';
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
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};

export const handler = middyfy(baseHandler);
