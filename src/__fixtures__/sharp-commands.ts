import { Command } from '@/types/input';

export const outputOptions: Command[] = [
  {
    name: 'withMetadata',
  },
  {
    name: 'toFormat',
    options: 'png',
  },
  {
    name: 'jpeg',
    options: {
      quality: 100,
      chromaSubsampling: '4:4:4',
    },
  },
  {
    name: 'png',
    options: { palette: true },
  },
  {
    name: 'webp',
    options: { lossless: true },
  },
  {
    name: 'gif',
    options: { dither: 0 },
  },
];

export const getChannelManipulation: Command[] = [
  {
    name: 'removeAlpha',
  },
  {
    name: 'ensureAlpha',
  },
  {
    name: 'extractChannel',
    options: 'green',
  },
  {
    name: 'toColorspace',
    options: 'rgb16',
  },
];

export const getColourManipulation: Command[] = [
  {
    name: 'tint',
    options: { r: 255, g: 240, b: 16 },
  },
  {
    name: 'greyscale',
  },
  {
    name: 'pipelineColourspace',
    options: 'rgb16',
  },
  {
    name: 'toColorspace',
    options: 'rgb16',
  },
];

export const getImageOperations: Command[] = [
  {
    name: 'resize',
    options: {
      width: 100,
      fit: 'contain',
    },
  },
  {
    name: 'rotate',
    options: 90,
  },
  {
    name: 'flip',
  },
  {
    name: 'flop',
  },
  {
    name: 'affine',
    options: [
      [1, 0.3],
      [0.1, 0.7],
    ],
  },
  {
    name: 'sharpen',
    options: {
      sigma: 2,
      m1: 0,
      m2: 3,
      x1: 3,
      y2: 15,
      y3: 15,
    },
  },
  {
    name: 'median',
    options: {
      size: 5,
    },
  },
  {
    name: 'blur',
    options: {
      sigma: 5,
    },
  },
  {
    name: 'flatten',
    options: {
      background: '#F0A703',
    },
  },
  {
    name: 'gamma',
    options: {
      gamma: 2.2,
      gammaOut: 2.2,
    },
  },
  {
    name: 'negate',
    options: {
      alpha: false,
    },
  },
  {
    name: 'normalize',
    options: {
      normalise: true,
    },
  },
  {
    name: 'clahe',
    options: {
      width: 3,
      height: 3,
    },
  },
  {
    name: 'convolve',
    options: {
      width: 3,
      height: 2,
      kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    },
  },
  {
    name: 'threshold',
    options: {
      width: 3,
      height: 2,
      kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    },
  },
  {
    name: 'linear',
    options: {
      a: 0.5,
      b: 2,
    },
  },
  {
    name: 'recombe',
    options: [
      [0.3588, 0.7044, 0.1368],
      [0.299, 0.587, 0.114],
      [0.2392, 0.4696, 0.0912],
    ],
  },
  {
    name: 'modulate',
    options: {
      brightness: 0.5,
      saturation: 0.5,
      hue: 90,
    },
  },
];
