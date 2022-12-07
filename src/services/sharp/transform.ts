import sharp, { FormatEnum } from 'sharp';
import type { Sharp } from 'sharp';
import createHttpError from 'http-errors';
import { Command, Input } from '@/types/input';
import logger from '../logger';

/**
 * Dynamically apply Sharp image transformations and return the result as a buffer
 * @param {Input} Input
 * @returns {Buffer}
 */
export const applyTransformations = async (input: Input): Promise<Buffer> => {
  try {
    const image: Sharp = await sharp(input.internal.source);

    // Option to retain meta-data
    if (input?.options?.retainMetadata) {
      image.withMetadata();
    }

    const { commands } = input;

    logger.debug(
      `Applying ${commands.length} Sharp image transformations: ${commands
        .map((cmd: Command) => cmd.name)
        .toString()
        .replace(/,/g, ', ')}`,
    );

    // Apply Sharp image transformations
    await Promise.all(
      commands
        .filter((cmd: Command) => cmd.skip !== true)
        .map(({ name, options }: Command) => {
          if (typeof image[name] !== 'function') {
            throw createHttpError(400, `Invalid Sharp method "${name}"`);
          }
          return options ? image[name](options) : image[name]();
        }),
    );

    // Create image output format and convert to Buffer
    return image
      .toFormat(<keyof FormatEnum>input.options.outputFormat)
      .toBuffer();
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
