import sharp, { FormatEnum } from 'sharp';
import type { Sharp } from 'sharp';
import createHttpError from 'http-errors';
import { Command, Input } from '@/types/input';
import logger from '../logger';

/**
 * Dynamically apply Sharp image transformations and return the result as a buffer
 * @param {string} outputFormat e.g jpg, png, gif
 * @param {Buffer} imageData
 * @param {ImageTransformation} transformations passed on to Sharp
 * @returns {Buffer}
 */
export const applyTransformations = async (
  outputFormat: string,
  imageData: Buffer,
  input: Input,
): Promise<Buffer> => {
  try {
    const image: Sharp = await sharp(imageData, {
      sequentialRead: true,
      failOn: 'error',
    });

    // Option to retain image metadata incl exif and icc
    if (input.options.retainMetadata) {
      image.withMetadata();
    }

    const { commands } = input;

    // Create and apply transformation commands
    await Promise.all(
      commands
        .filter((op) => op.skip !== true)
        .map(({ name: command, options }: Command) => {
          if (typeof image[command] !== 'function') {
            throw createHttpError(400, `Invalid Sharp command "${command}"`);
          }
          return options ? image[command](options) : image[command]();
        }),
    );

    logger.debug(
      `Successfully applied ${
        commands.length
      } Sharp transformations: ${commands.map((cmd) => cmd.name).toString()}`,
    );
    // Create image output format and convert to Buffer
    return image.toFormat(<keyof FormatEnum>outputFormat).toBuffer();
  } catch (error) {
    const { name, message } = <Error>error;
    logger.error(
      `Error applying Sharp image transformations ${name} ${message}`,
      {
        data: {
          input,
        },
      },
    );
    throw error;
  }
};
