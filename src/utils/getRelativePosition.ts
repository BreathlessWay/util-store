export const getRelativePosition = <K extends keyof HTMLElementEventMap>(
  ev: HTMLElementEventMap[K]
) => {
  const { clientY, clientX, target } = ev as MouseEvent,
    { left, top, width, height } = (
      target as HTMLElement
    ).getBoundingClientRect();

  return {
    left: (((clientX - left) / width) * 100).toFixed(2) + "%",
    top: (((clientY - top) / height) * 100).toFixed(2) + "%",
  };
};
