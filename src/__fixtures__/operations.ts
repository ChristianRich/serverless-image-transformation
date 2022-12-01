// export interface Operation {
//   command: string;
//   options?: any;
// }

const outputOptions = [
  {
    command: 'withMetadata',
  },
  {
    command: 'toFormat',
    options: 'png',
  },
  {
    command: 'jpeg',
    options: {
      quality: 100,
      chromaSubsampling: '4:4:4',
    },
  },
  {
    command: 'png',
    options: { palette: true },
  },
  {
    command: 'webp',
    options: { lossless: true },
  },
  {
    command: 'gif',
    options: { dither: 0 },
  },
];

const getChannelManipulation = [
  {
    command: 'removeAlpha',
  },
  {
    command: 'ensureAlpha',
  },
  {
    command: 'extractChannel',
    options: 'green',
  },
  {
    command: 'toColorspace',
    options: 'rgb16',
  },
];

const getColourManipulation = [
  {
    command: 'tint',
    options: { r: 255, g: 240, b: 16 },
  },
  {
    command: 'greyscale',
  },
  {
    command: 'pipelineColourspace',
    options: 'rgb16',
  },
  {
    command: 'toColorspace',
    options: 'rgb16',
  },
];

export const getImageOperations = [
  {
    command: 'resize',
    options: {
      width: 100,
      fit: 'contain',
    },
  },
  {
    command: 'rotate',
    options: 90,
  },
  {
    command: 'flip',
  },
  {
    command: 'flop',
  },
  {
    command: 'affine',
    options: [
      [1, 0.3],
      [0.1, 0.7],
    ],
  },
  {
    command: 'sharpen',
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
    command: 'median',
    options: {
      size: 5,
    },
  },
  {
    command: 'blur',
    options: {
      sigma: 5,
    },
  },
  {
    command: 'flatten',
    options: {
      background: '#F0A703',
    },
  },
  {
    command: 'gamma',
    options: {
      gamma: 2.2,
      gammaOut: 2.2,
    },
  },
  {
    command: 'negate',
    options: {
      alpha: false,
    },
  },
  {
    command: 'normalize',
    options: {
      normalise: true,
    },
  },
  {
    command: 'clahe',
    options: {
      width: 3,
      height: 3,
    },
  },
  {
    command: 'convolve',
    options: {
      width: 3,
      height: 2,
      kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    },
  },
  {
    command: 'threshold',
    options: {
      width: 3,
      height: 2,
      kernel: [-1, 0, 1, -2, 0, 2, -1, 0, 1],
    },
  },
  {
    command: 'linear',
    options: {
      a: 0.5,
      b: 2,
    },
  },
  {
    command: 'recombe',
    options: [
      [0.3588, 0.7044, 0.1368],
      [0.299, 0.587, 0.114],
      [0.2392, 0.4696, 0.0912],
    ],
  },
  {
    command: 'modulate',
    options: {
      brightness: 0.5,
      saturation: 0.5,
      hue: 90,
    },
  },
];
