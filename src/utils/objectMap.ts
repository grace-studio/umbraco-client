export const objectMap = (
  inputObject: Record<string, (rawProperties: Record<string, any>) => any>,
  rawProperties: Record<string, any>,
): Record<string, any> => {
  const entries = Object.entries(inputObject);
  const mappedEntries = entries.map(([key, func]) => [
    key,
    func(rawProperties),
  ]);

  return Object.fromEntries(mappedEntries);
};
