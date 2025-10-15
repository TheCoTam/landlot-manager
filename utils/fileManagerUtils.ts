export const fileSizeFormater = (size: number | null) => {
  if (!size || isNaN(size) || size < 0) return "0 B";

  const units = ["B", "KB", "MB", "GB", "TB"];
  let index = 0;

  while (size >= 1024 && index < units.length - 1) {
    size /= 1024;
    index++;
  }

  return `${size.toFixed(2)} ${units[index]}`;
};
