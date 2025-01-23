export const ensureArray = <T>(array: T[] | T): T[] => {
  return Array.isArray(array) ? array : [array];
};
