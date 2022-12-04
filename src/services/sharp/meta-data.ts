import sharp, { Metadata } from 'sharp';
import type { Sharp } from 'sharp';
import logger from '../logger';

export const getMetadata = async (imageData: Buffer): Promise<Metadata> => {
  try {
    const image: Sharp = await sharp(imageData);
    return image.metadata();
  } catch (error) {
    const { name, message } = <Error>error;
    logger.error(`Error resolving Sharp image meta-data ${name} ${message}`);
    throw error;
  }
};
