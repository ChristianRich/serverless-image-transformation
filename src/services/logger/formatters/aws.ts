import { LogFormatter } from '@aws-lambda-powertools/logger';
import {
  LogAttributes,
  UnformattedAttributes,
} from '@aws-lambda-powertools/logger/lib/types';

export class DetailedLogFormatter extends LogFormatter {
  public formatAttributes(attr: UnformattedAttributes): LogAttributes {
    return {
      message: attr.message,
      service: attr.serviceName,
      environment: attr.environment,
      awsRegion: attr.awsRegion,
      correlationIds: {
        awsRequestId: attr.lambdaContext?.awsRequestId,
        xRayTraceId: attr.xRayTraceId,
      },
      lambdaFunction: {
        name: attr.lambdaContext?.functionName,
        arn: attr.lambdaContext?.invokedFunctionArn,
        memoryLimitInMB: attr.lambdaContext?.memoryLimitInMB,
        version: attr.lambdaContext?.functionVersion,
        coldStart: attr.lambdaContext?.coldStart,
      },
      logLevel: attr.logLevel,
      timestamp: this.formatTimestamp(attr.timestamp),
      logger: {
        sampleRateValue: attr.sampleRateValue,
      },
    };
  }
}
