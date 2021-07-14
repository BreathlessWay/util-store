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
