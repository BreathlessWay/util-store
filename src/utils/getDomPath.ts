export const getDomPath = <K extends keyof HTMLElementEventMap>(
  ev: HTMLElementEventMap[K]
) => {
  const _path = ev.path;
  let pathResult = "";
  if (_path && _path.length) {
    _path.forEach((item, index: number) => {
      const classname = Array.prototype.join.call(item.classList || [], "."),
        id = item.id;
      let name = item.localName;
      if (name) {
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
