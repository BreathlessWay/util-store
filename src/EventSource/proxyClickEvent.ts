import { getDomPath } from "utils/getDomPath";
import { getRelativePosition } from "utils/getRelativePosition";
import { getDomContent } from "utils/getDomContent";

export const proxyClickEvent = (collectEventData: Function) => {
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
        const domPath = getDomPath(ev),
          relativePosition = getRelativePosition(ev),
          domContent = getDomContent(ev);
        console.log(relativePosition, domPath, domContent);
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

  Object.defineProperty(HTMLElement.prototype, "onclick", {
    set(fun) {
      this.addEventListener("click", fun);
    },
  });

  window.addEventListener("click", (ev) => {
    collectEventData(ev);
  });
};
