export interface Input {
  source?: Source;
  destination?: Destination;
  options?: Options;
  commands?: Command[];
  internal?: Internal;
}

export interface Internal {
  source: Buffer;
}

export interface Command {
  name: string;
  options?: unknown;
  skip?: boolean;
}

export interface Options {
  outputFormat: string;
  retainMetadata?: boolean;
}

export interface Source {
  http?: {
    url: string;
    forwardHeaders: string[];
  };
  s3?: S3Bucket;
}

export interface Destination {
  http?: boolean;
  s3?: S3Bucket;
}

export interface S3Bucket {
  bucket?: string;
  key?: string;
}

export const requestBodyValidationSchema = {
  type: 'object',
  properties: {
    source: {
      type: 'object',
      properties: {
        http: { $ref: '#/$defs/http' },
        s3: { $ref: '#/$defs/s3' },
      },
      oneOf: [
        {
          type: 'object',
          required: ['http'],
        },
        {
          type: 'object',
          required: ['s3'],
        },
      ],
    },
    destination: {
      type: 'object',
      properties: {
        http: {
          type: 'boolean',
        },
        s3: { $ref: '#/$defs/s3' },
      },
      additionalProperties: false,
      anyOf: [
        {
          type: 'object',
          required: ['http'],
        },
        {
          type: 'object',
          required: ['s3'],
        },
      ],
    },
    options: {
      type: 'object',
      properties: {
        outputFormat: {
          type: 'string',
        },
        retainMetadata: {
          type: 'boolean',
        },
      },
      additionalProperties: false,
    },
    commands: {
      type: 'array',
      items: { $ref: '#/$defs/command' },
    },
  },
  required: ['source', 'commands'],
  additionalProperties: false,
  $defs: {
    http: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
        },
        forwardHeaders: {
          type: 'array',
          items: [
            {
              type: 'string',
            },
          ],
        },
      },
      required: ['url'],
      additionalProperties: false,
    },
    s3: {
      type: 'object',
      properties: {
        bucket: {
          type: 'string',
        },
        key: {
          type: 'string',
        },
      },
      required: ['bucket', 'key'],
      additionalProperties: false,
    },
    command: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Name of the Sharp image operation to apply',
        },
        options: {
          type: ['object', 'string', 'integer', 'number', 'array'],
          description: 'Matching options for the applied command (optional)',
        },
        skip: {
          type: 'boolean',
          description: 'Command execution skipped when true (optional)',
        },
      },
      required: ['name'],
      additionalProperties: false,
    },
  },
} as const;
