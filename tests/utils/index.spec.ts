import { generateUUID } from '../../src/utils';

describe('generateUUID', () => {
  test('should return a random UUID', () => {
    expect(generateUUID()).toHaveLength(32);
  });

  test('should be unique', () => {
    const first = generateUUID();
    expect(generateUUID()).not.toBe(first);
  });
});
