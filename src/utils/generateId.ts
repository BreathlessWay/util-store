export const generateUUID = (() => {
  const bth: Array<string> = [];
  return () => {
    if (bth.length === 0) {
      for (let i = 0; i < 256; ++i) {
        bth[i] = (i + 0x100).toString(16).substr(1);
      }
    }
    const buf = [];
    let i = 0;
    for (let idx = 0; idx < 16; ++idx) {
      buf[idx] = Math.floor(Math.random() * 256);
    }
    return [
      bth[buf[++i]],
      bth[buf[++i]],
      bth[buf[++i]],
      bth[buf[++i]],
      "-",
      bth[buf[++i]],
      bth[buf[++i]],
      "-",
      bth[buf[++i]],
      bth[buf[++i]],
      "-",
      bth[buf[++i]],
      bth[buf[++i]],
      "-",
      bth[buf[++i]],
      bth[buf[++i]],
      bth[buf[++i]],
      bth[buf[++i]],
      bth[buf[++i]],
      bth[buf[++i]],
    ].join("");
  };
})();

export const generateNormalId = () => {
  try {
    return (
      "-" + Date.now().toString(36) + Math.random().toString(36).split(".")[1]
    );
  } catch (e) {
    return "-" + Date.now().toString() + Math.random().toString().split(".")[1];
  }
};

const formatDate = function (date: Date, format: string) {
  let n = date.getFullYear().toString(),
    o = (date.getMonth() + 1).toString(),
    i = date.getDate().toString(),
    r = date.getHours().toString(),
    a = date.getMinutes().toString(),
    s = date.getSeconds().toString();
  return (
    (o = 9 < (o as unknown as number) ? o : "0" + o),
    (i = 9 < (i as unknown as number) ? i : "0" + i),
    (r = 9 < (r as unknown as number) ? r : "0" + r),
    (a = 9 < (a as unknown as number) ? a : "0" + a),
    (s = 9 < (s as unknown as number) ? s : "0" + s),
    format
      .replace("y", n)
      .replace("M", o)
      .replace("d", i)
      .replace("h", r)
      .replace("m", a)
      .replace("s", s)
  );
};

export const getUuid = () => {
  const time = formatDate(new Date(), "yMdhms");
  return (
    "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (e) => {
      const t = (16 * Math.random()) | 0;
      return ("x" == e ? t : (3 & t) | 8).toString(16);
    }) +
    "-" +
    time
  );
};
