export const shortenDescription = (description) => {
  if (description.length > 50) {
    return description.substring(0, 100) + "...";
  }
  return description;
};
