import { getDomPath } from "utils/getDomPath";

export const proxyAddEventListener = (collectEventData: Function) => {
  const originAddEventListener = HTMLElement.prototype.addEventListener;

  HTMLElement.prototype.addEventListener = function <
    K extends keyof HTMLElementEventMap
  >(
    type: K,
    listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions
  ): void {
    let listenerWrap = listener;
    if (type === "click") {
      listenerWrap = (ev: HTMLElementEventMap[K]) => {
        const domPath = getDomPath(ev);
        console.log(domPath);
        collectEventData(ev);
        listener.call(this, ev);
      };
    }
    return originAddEventListener.call(
      this,
      type,
      listenerWrap as EventListenerOrEventListenerObject,
      options
    );
  };
};

export const proxyOnClick = () => {
  Object.defineProperty(HTMLElement.prototype, "onclick", {
    set(fun) {
      this.addEventListener("click", fun);
    },
  });
};
