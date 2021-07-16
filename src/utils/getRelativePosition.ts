export const getRelativePosition = <K extends keyof HTMLElementEventMap>(
  ev: HTMLElementEventMap[K]
) => {
  const { pageX, pageY, target } = ev as MouseEvent,
    { offsetLeft, offsetTop } = target as HTMLElement;

  return {
    left: pageX - offsetLeft,
    top: pageY - offsetTop,
  };
};
