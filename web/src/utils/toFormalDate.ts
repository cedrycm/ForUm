export const toFormalDate = (unixTimestamp: string) => {
  const date = new Date(parseInt(unixTimestamp));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
