import sharp, { FormatEnum } from 'sharp';
import type { Sharp } from 'sharp';
import { Operation, ImageTransformation } from '@/types/sharp';
import createHttpError from 'http-errors';
import logger from '../logger';

/**
 * Dynamically apply Sharp image transformations and return the result as buffer
 * @param {string} outputFormat e.g jpg, png, gif
 * @param {Buffer} imageData Image data
 * @param {ImageTransformation} transformations instructions passed on to Sharp
 * @returns {Buffer}
 */
export const applyTransformations = async (
  outputFormat: string,
  imageData: Buffer,
  transformations: ImageTransformation,
): Promise<Buffer> => {
  try {
    const image: Sharp = await sharp(imageData);

    // Option to retain image metadata incl exif
    if (transformations.withMetadata) {
      image.withMetadata();
    }

    // Create transformation tasks
    const promises: Promise<Sharp>[] = transformations.operations
      .filter((operation) => operation.skip !== true)
      .map(({ command, options }: Operation) => {
        if (typeof image[command] !== 'function') {
          throw createHttpError(400, `Invalid Sharp command "${command}"`);
        }

        return options ? image[command](options) : image[command]();
      });

    // Apply transformation tasks
    await Promise.all(promises);

    // Convert result to selected output format
    const result: Buffer = await image
      .toFormat(<keyof FormatEnum>outputFormat)
      .toBuffer();

    return result;
  } catch (error) {
    logger.error('Error applying image transformations', {
      data: {
        outputFormat,
        transformations,
      },
    });
    throw error;
  }
};
