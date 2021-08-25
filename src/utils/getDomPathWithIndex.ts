export const getDomPathWithIndex = <K extends keyof HTMLElementEventMap>(
  ev: HTMLElementEventMap[K]
) => {
  // 兼容 firefox
  const _path = ev.path || (ev.composedPath && ev.composedPath());
  let pathResult = "";
  if (_path && _path.length) {
    _path.forEach((item, index: number) => {
      const classname = Array.prototype.join.call(item.classList || [], "."),
        id = item.id;
      let previousSibling = item.previousElementSibling,
        nextSibling = item.nextElementSibling,
        i = 0,
        hasSibling = Boolean(previousSibling || nextSibling);

      while (previousSibling) {
        i--;
        previousSibling = previousSibling.previousElementSibling;
      }

      let name = item.localName;
      if (name) {
        if (name !== "html" && name !== "body" && hasSibling) {
          i = Math.abs(i) + 1;
          name = `${item.localName}[${i}]`;
        }
        if (id) {
          name = name + "#" + id;
        }
        if (classname) {
          name = name + "." + classname;
        }
        pathResult = `${name}${index === 0 ? "" : ">"}${pathResult}`;
      }
    });
  }
  return pathResult;
};
