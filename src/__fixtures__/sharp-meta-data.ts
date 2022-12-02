export const getMetadata = (): Record<
  string,
  string | number | boolean | Buffer
> => ({
  format: 'jpeg',
  size: 744098,
  width: 2301,
  height: 1667,
  space: 'srgb',
  channels: 3,
  depth: 'uchar',
  density: 72,
  chromaSubsampling: '4:2:0',
  isProgressive: true,
  resolutionUnit: 'inch',
  hasProfile: true,
  hasAlpha: false,
  orientation: 1,
  icc: Buffer.from('mock icc'),
  exif: Buffer.from('mock exif'),
});
