// eslint-disable-next-line import/prefer-default-export
export const randomIntFromInterval = (min, max) => Math.floor(
  Math.random() * (max - min + 1) + min,
);
