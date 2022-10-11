import { format, parseJSON } from "date-fns";

export const formatDate = (timeStamp: string) => {
  const parsedTime = parseJSON(timeStamp);
  return format(parsedTime, "yyyy-MM-dd HH:mm:ss");
};
