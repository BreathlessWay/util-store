export const getDomPathWithIndex = (ev: Event) => {
  const _path = ev.path;
  let pathResult = "";
  if (_path && _path.length) {
    _path.forEach((item: Element, index: number) => {
      const classname = Array.prototype.join.call(item.classList || [], "."),
        id = item.id;
      let previousSibling = item.previousSibling || item.previousElementSibling,
        i = 0;

      while (previousSibling) {
        i--;
        previousSibling =
          previousSibling.previousSibling ||
          (previousSibling as any).previousElementSibling;
      }
      i = Math.abs(i) + 1;

      let name = item.localName;
      if (name) {
        name = `${item.localName}-${i}`;
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
