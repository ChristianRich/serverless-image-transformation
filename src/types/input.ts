// Represents the image transformation input options as provided by the user
export interface Input {
  source?: Source;
  destination?: Destination;
  options?: Options;
  commands?: Command[];
  internal?: Internal;
}

// User internally to pass the source image around
export interface Internal {
  source: Buffer;
}

// A Sharp image transformation command
export interface Command {
  // Operation name e.g 'reszie'. See Sharp docs for details
  name: string;

  // Options passed to image operation. See the Sharp docs for details
  options?: Options;

  // When true, filter is skipped. Handy when composing complex transformations and you want to toggle filters on/off and compare results. Defaults to false
  skip?: boolean;
}

export interface Options {
  // Output format e.g jpg, png, gif. When not supplied will fallback on the format of the source image. See Sharp docs for details
  outputFormat?: string;

  // When true keeps the image meta data incl exif for the transformation output. Defaults to false
  retainMetadata?: boolean;
}

// Image source either URL or S3
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
  bucket: string;
  key: string;
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
