export const getErrorKey = (str: string, key: string) => {
  let chars = "ABCDEFGHJKMNPQRSTWXYZ";
  if (!str || !key) {
    return "null";
  }
  let n = 0,
    m = 0;
  for (let i = 0; i < str.length; i++) {
    n += str.charCodeAt(i);
  }
  for (let j = 0; j < key.length; j++) {
    m += key.charCodeAt(j);
  }
  let num =
    n +
    "" +
    key.charCodeAt(key.length - 1) +
    m +
    str.charCodeAt(str.length - 1);
  if (num) {
    num = num + chars[num[num.length - 1] as unknown as number];
  }
  return num;
};
