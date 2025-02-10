export const formatCoordinates = (coordinates: number[]): string => {
  const longitude = coordinates[0];
  const latitude = coordinates[1];
  const formattedLongitude = Math.abs(longitude).toFixed(3) + (longitude >= 0 ? '°E' : '°W');
  const formattedLatitude = Math.abs(latitude).toFixed(3) + (latitude >= 0 ? '°N' : '°S');
  return `${formattedLatitude} ${formattedLongitude}`;
};
