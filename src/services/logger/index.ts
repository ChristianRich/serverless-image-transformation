import { isAWS } from '@/utils/env';
import { LogFormatter, Logger } from '@aws-lambda-powertools/logger';
import { DetailedLogFormatter } from './formatters/aws';
import { LocalhostLogFormatter } from './formatters/local';

const logFormatter: LogFormatter = isAWS()
  ? new DetailedLogFormatter()
  : new LocalhostLogFormatter();

const logger: Logger = new Logger({
  logFormatter,
  logLevel: process.env.LOG_LEVEL || 'DEBUG',
  serviceName: process.env.AWS_LAMBDA_FUNCTION_NAME,
});

const getLogger = (): Logger => logger;
export default getLogger();
