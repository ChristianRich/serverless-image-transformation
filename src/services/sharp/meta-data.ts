import sharp, { Metadata } from 'sharp';
import type { Sharp } from 'sharp';
import { omit } from 'lodash';
import logger from '../logger';

export const getMetadata = async (imageData: Buffer): Promise<Metadata> => {
  try {
    const image: Sharp = await sharp(imageData);
    const metaData: Metadata = await image.metadata();

    logger.debug('Decoded source image meta-data', {
      data: omit(metaData, ['icc', 'exif']),
    });

    return metaData;
  } catch (error) {
    const { name, message } = <Error>error;
    logger.error(`Error resolving Sharp image meta-data ${name} ${message}`);
    throw error;
  }
};
