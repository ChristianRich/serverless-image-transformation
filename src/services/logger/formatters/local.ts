import { LogFormatter } from '@aws-lambda-powertools/logger';
import {
  LogAttributes,
  UnformattedAttributes,
} from '@aws-lambda-powertools/logger/lib/types';

export class LocalhostLogFormatter extends LogFormatter {
  // eslint-disable-next-line class-methods-use-this
  public formatAttributes(attr: UnformattedAttributes): LogAttributes {
    return {
      logLevel: attr.logLevel,
      message: attr.message,
    };
  }
}
