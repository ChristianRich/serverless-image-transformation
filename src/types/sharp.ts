import { JsonObject } from 'type-fest';

export interface ImageTransformation {
  // Public URL for the image
  source: ImageSource;
  // jpg, png, gif, webp etc ..
  outputFormat: string;
  // When true, retains metadata after transformations
  withMetadata?: boolean;
  // Array of image transformations to apply
  operations: Operation[];
}

export interface ImageSource {
  // Image source
  url: string;
  // Forward headers to image source (e.g x-api-key, authorization)
  forwardHeaders: string[];
}

// Represents a Sharp image transform operation
// https://sharp.pixelplumbing.com/api-operation
export interface Operation {
  // rotate, resize, blur etc ..
  command: string;
  // Options compatible with the selected command
  options?: Options;
  // When true, transformation is ignored
  skip?: boolean;
}

// Command options can be complex or primitive types
export type Options = JsonObject | number | string;
