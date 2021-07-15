export const getRelativePosition = (ev: MouseEvent) => {
  const { pageX, pageY, target } = ev,
    { offsetLeft, offsetTop } = target as HTMLElement;

  return {
    left: pageX - offsetLeft,
    top: pageY - offsetTop,
  };
};
