export const getDomPath = (ev: Event) => {
  const _path = (ev as any).path;
  let pathResult = "";
  if (_path && _path.length) {
    _path.forEach((item: Element, index: number) => {
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
