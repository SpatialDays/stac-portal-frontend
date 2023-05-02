export const shortenDescription = (description, length = 100) => {
  if (description.length > length) {
    return description.substring(0, length) + "...";
  }
  return description;
};
