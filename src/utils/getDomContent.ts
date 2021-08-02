export const getDomContent = <K extends keyof HTMLElementEventMap>(
  ev: HTMLElementEventMap[K]
) => {
  let firstChild = ev.target as HTMLElement;
  while (firstChild && !(firstChild instanceof Text)) {
    firstChild = firstChild.firstChild as HTMLElement;
  }
  if (firstChild && firstChild.textContent) {
    return encodeURIComponent(firstChild.textContent.slice(0, 1024));
  }
  return "";
};
