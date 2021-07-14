import { TIMESTAMP_LENGTH } from "type/constants";

export const getTimestamp = () => {
  let timestamp = window.Date.now().toString(),
    timestampLength = timestamp.length;
  if (timestampLength < TIMESTAMP_LENGTH) {
    const len = TIMESTAMP_LENGTH - timestampLength;
    for (let i = 0; i < len; ++i) {
      timestamp += "0";
    }
  }
  if (timestampLength > TIMESTAMP_LENGTH) {
    timestamp = timestamp.slice(0, timestampLength);
  }
  return timestamp;
};
