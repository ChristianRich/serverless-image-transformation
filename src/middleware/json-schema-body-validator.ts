import middy from '@middy/core';
import createError from 'http-errors';
import {
  validate,
  ValidatorResult,
  ValidationError,
  Options,
} from 'jsonschema';
import { ValidatedEventAPIGatewayProxyEvent } from '@/types/api-gateway';
import { APIGatewayProxyResult } from 'aws-lambda';

const mimePattern = /^application\/(.+\+)?json(;.*)?$/;

export const jsonSchemaBodyValidator = <T>(
  schema: T,
  options?: Options,
): middy.MiddlewareObj<
  ValidatedEventAPIGatewayProxyEvent<typeof schema>,
  APIGatewayProxyResult
> => {
  const before = (request: middy.Request): void => {
    const { headers, body } = request.event;
    const contentTypeHeader = headers?.['content-type'];

    if (!mimePattern.test(contentTypeHeader)) {
      return;
    }

    if (typeof body === 'string') {
      throw createError(422, 'Request body cannot be parsed as a string');
    }

    const result: ValidatorResult = validate(body, schema, options);
    const { errors } = result;

    if (errors?.length) {
      const e: ValidationError = result.errors[0];
      const message = `${e.path} ${e.message}} @property ${e.property}`;
      throw createError(400, message);
    }
  };

  return {
    before,
  };
};
