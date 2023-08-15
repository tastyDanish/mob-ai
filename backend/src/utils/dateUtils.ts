export const epochToTimestamp = (epochTimestamp: number): string => {
  const date = new Date(epochTimestamp * 1000);
  const isoString = date.toISOString();
  return isoString;
};
