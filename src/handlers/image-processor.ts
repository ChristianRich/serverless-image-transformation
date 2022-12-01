import logger from '@/services/logger';
import type {
  ValidatedAPIGatewayProxyEvent,
  ValidatedEventAPIGatewayProxyEvent,
} from '@/types/api-gateway';
import type { HttpError } from 'http-errors';
import { middyfyWithRequestBody } from '@/middleware';
import { applyTransformations } from '@/services/sharp';
import { ImageTransformation } from '@/types/sharp';
import { fetchImage } from '@/services/http/image';

const requestBodyValidationSchema = {
  type: 'object',
  properties: {
    source: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
        },
        forwardHeaders: {
          type: ['array'],
          items: {
            type: 'string',
          },
        },
      },
      required: ['url'],
    },
    outputFormat: {
      type: 'string',
    },
    withMetadata: {
      type: 'boolean',
    },
    operations: {
      type: 'array',
      items: { $ref: '#/$defs/operation' },
    },
  },
  $defs: {
    operation: {
      type: 'object',
      properties: {
        command: {
          type: 'string',
          description: 'Name of the Sharp image operation to apply',
        },
        options: {
          type: ['object', 'string', 'integer', 'number'],
        },
      },
      required: ['command'],
    },
  },
  required: ['outputFormat', 'operations'],
  additionalProperties: false,
} as const;

const baseHandler: ValidatedEventAPIGatewayProxyEvent<
  typeof requestBodyValidationSchema
> = async (
  event: ValidatedAPIGatewayProxyEvent<typeof requestBodyValidationSchema>,
) => {
  const { body, headers } = event;
  const { outputFormat } = body;

  try {
    // Fetch the source image
    const imageData: Buffer = await fetchImage(
      body.source.url,
      body.source?.forwardHeaders,
      headers,
    );

    // Apply transformations
    const result: Buffer = await applyTransformations(
      outputFormat,
      imageData,
      <ImageTransformation>body,
    );

    // Return raw image data
    return {
      statusCode: 200,
      headers: {
        'Content-Type': `image/${outputFormat}`,
      },
      body: result.toString('base64'),
      isBase64Encoded: true,
    };
  } catch (error) {
    const { name, message, statusCode = 500 } = <Error | HttpError>error;
    logger.error(`Image operation failed: ${statusCode} ${name} ${message}`);
    throw error;
  }
};

export const handler = middyfyWithRequestBody(
  baseHandler,
  requestBodyValidationSchema,
);
