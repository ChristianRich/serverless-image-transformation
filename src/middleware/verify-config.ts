import type { Config } from '@/constants';
import { getConfig } from '@/utils/env';
import middy from '@middy/core';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';

export const verifyConfig = (
  config: Config,
): middy.MiddlewareObj<APIGatewayProxyEvent, APIGatewayProxyResult> => {
  const before = (): void => {
    Object.keys(config).forEach((key) => {
      if (Object.prototype.hasOwnProperty.call(config, key)) {
        getConfig(<Config>key);
      }
    });
  };

  return {
    before,
  };
};
