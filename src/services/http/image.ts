import { APIGatewayProxyEventHeaders } from 'aws-lambda';
import axios, { AxiosRequestConfig } from 'axios';

export const fetchImage = async (
  url: string,
  forwardHeaders: string[] = [],
  requestHeaders: APIGatewayProxyEventHeaders,
): Promise<Buffer> => {
  const config: AxiosRequestConfig = {
    responseType: 'arraybuffer',
  };

  const headers = forwardHeaders.reduce((acc, curr) => {
    const value = requestHeaders[curr];
    if (value) acc[curr] = value;
    return acc;
  }, {});

  if (Object.keys(headers).length) {
    config.headers = headers;
  }

  const { data } = await axios.get(url, config);
  return data;
};
