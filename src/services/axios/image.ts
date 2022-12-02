import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import axios, { AxiosRequestConfig } from 'axios';
import logger from '../logger';

export const fetchImage = async (
  url: string,
  forwardHeaders: string[] = [],
  requestHeaders: APIGatewayProxyEventHeaders,
): Promise<Buffer> => {
  const config: AxiosRequestConfig = {
    responseType: 'arraybuffer',
  };

  // Forward security headers to image source (typically `x-api-key` or `authorization`)
  const headers: Record<string, string> = forwardHeaders.reduce((acc, curr) => {
    const value = requestHeaders[curr];
    if (value) acc[curr] = value;
    return acc;
  }, {});

  if (Object.keys(headers).length) {
    config.headers = headers;
  }

  const { data } = await axios.get(url, config);
  logger.debug(`Loaded source image from ${url}`);
  return data;
};
