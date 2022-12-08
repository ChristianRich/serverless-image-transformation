/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import errorHandler from '@schibsted/middy-error-handler';
import { jsonSchemaBodyValidator } from '@/middleware/json-schema-body-validator';
import { setLoggerContext } from '@/middleware/set-logger-context';
import logger from '@/services/logger';
import { Config } from '@/constants';
import { verifyConfig } from './verify-config';

export const middyfy = (handler): middy.MiddyfiedHandler =>
  middy(handler)
    .use(setLoggerContext(logger))
    .use(httpHeaderNormalizer())
    .use(verifyConfig(Config))
    .use(httpSecurityHeaders())
    .use(
      errorHandler({ exposeStackTrace: process.env.NODE_ENV !== 'production' }),
    );

export const middyfyWithRequestBody = (
  handler,
  requestBodyValidationSchema: Record<string, unknown>,
): middy.MiddyfiedHandler =>
  middy(handler)
    .use(setLoggerContext(logger))
    .use(httpHeaderNormalizer())
    .use(verifyConfig(Config))
    .use(middyJsonBodyParser())
    .use(jsonSchemaBodyValidator(requestBodyValidationSchema))
    .use(httpSecurityHeaders())
    .use(
      errorHandler({ exposeStackTrace: process.env.NODE_ENV !== 'production' }),
    );
