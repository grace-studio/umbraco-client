type TransformFunction<T, U> = (value: T, key: string, index: number) => U;

export const objectMap = <T, U>(
  inputObject: Record<string, T>,
  transformFunction: TransformFunction<T, U>,
): Record<string, U> => {
  const entries = Object.entries(inputObject);
  const mappedEntries = entries.map(([key, value], index) => [
    key,
    transformFunction(value, key, index),
  ]);

  return Object.fromEntries(mappedEntries);
};
