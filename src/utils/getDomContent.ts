export const getDomContent = <K extends keyof HTMLElementEventMap>(
  ev: HTMLElementEventMap[K]
) => {
  let firstChild = ev.target as HTMLElement;
  while (firstChild && !(firstChild instanceof Text)) {
    firstChild = firstChild.firstChild as HTMLElement;
  }
  if (firstChild) {
    return firstChild.textContent;
  }
  return "";
};
