export const formatDate = (dateString: number): string => {
  const date = new Date(dateString);
  const hours = String(date.getUTCHours() + 3).padStart(2, '0');
  const seconds = String(date.getUTCSeconds()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const timeZoneOffset = '+03:00';
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds} (UTC${timeZoneOffset})`;
};
