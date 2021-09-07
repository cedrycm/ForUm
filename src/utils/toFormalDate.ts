export const toFormalDate = (unixTimestamp: string) => {
  console.log(unixTimestamp);
  const date = new Date(parseInt(unixTimestamp));
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
