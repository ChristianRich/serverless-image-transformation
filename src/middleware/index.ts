import middy from '@middy/core';
import middyJsonBodyParser from '@middy/http-json-body-parser';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import httpSecurityHeaders from '@middy/http-security-headers';
import errorHandler from '@schibsted/middy-error-handler';
import { jsonSchemaBodyValidator } from '@/middleware/json-schema-body-validator';
import { setLoggerContext } from '@/middleware/set-logger-context';
import logger from '@/services/logger';

const exposeStackTrace = process.env.NODE_ENV !== 'prd';

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const middyfy = (handler): middy.MiddyfiedHandler =>
  middy(handler)
    .use(setLoggerContext(logger))
    .use(httpHeaderNormalizer())
    .use(httpSecurityHeaders())
    .use(errorHandler({ exposeStackTrace }));

export const middyfyWithRequestBody = (
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  handler,
  requestBodyValidationSchema: Record<string, unknown>,
): middy.MiddyfiedHandler =>
  middy(handler)
    .use(setLoggerContext(logger))
    .use(httpHeaderNormalizer())
    .use(middyJsonBodyParser())
    .use(jsonSchemaBodyValidator(requestBodyValidationSchema))
    .use(httpSecurityHeaders())
    .use(errorHandler({ exposeStackTrace }));
