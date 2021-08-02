import { getDomPath } from "utils/getDomPath";
import { getDomPathWithIndex } from "utils/getDomPathWithIndex";
import { getRelativePosition } from "utils/getRelativePosition";
import { getDomContent } from "utils/getDomContent";

import { DocumentReadyState, TIME_GAP } from "src/type/constants";

export const proxyUIEvent = (collectEventData: CollectEventDataType) => {
  let lastTimer = Date.now();
  const originAddEventListener = EventTarget.prototype.addEventListener;
  EventTarget.prototype.addEventListener = function <
    K extends keyof HTMLElementEventMap
  >(
    type: K,
    listener: (ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    let listenerWrap = (ev: HTMLElementEventMap[K]) => {
      if (type === "click") {
        const domPath = getDomPath(ev),
          domPathWithIndex = getDomPathWithIndex(ev),
          relativePosition = getRelativePosition(ev),
          domContent = getDomContent(ev);
        collectEventData({
          ...ev,
          relativePosition,
          domPathWithIndex,
          domPath,
          domContent,
          eventType: "ui.click",
        });
      }
      if (type === "scroll") {
        let currentTimer = Date.now();
        if (currentTimer - lastTimer > TIME_GAP) {
          collectEventData({ ...ev, eventType: "ui.scroll" });
          lastTimer = currentTimer;
        }
      }
      if (type === "touchstart") {
        collectEventData({ ...ev, eventType: "ui.touchstart" });
      }
      if (type === "touchend") {
        collectEventData({ ...ev, eventType: "ui.touchend" });
      }
      // 由于我们一般会将静态资源存放在 cdn 等第三方域名上，所以当前业务域名中的 window.onerror 会将这类错误统一展示为 Script error。
      // 浏览器不会对 try-catch 起来的异常进行跨域拦截，所以我们采用劫持原生方法，将原生方法用 try/catch 的函数包裹来处理。
      try {
        return listener.call(this, ev);
      } catch (error) {
        throw error;
      }
    };

    return originAddEventListener.call(
      this,
      type,
      listenerWrap as EventListener,
      options
    );
  };

  Object.defineProperty(EventTarget.prototype, "onclick", {
    set(fun) {
      this.addEventListener("click", fun);
    },
  });
  Object.defineProperty(EventTarget.prototype, "scroll", {
    set(fun) {
      this.addEventListener("scroll", fun);
    },
  });

  window.addEventListener("click", (ev) => {});
  window.addEventListener("scroll", (ev) => {});
  window.addEventListener("touchstart", (ev) => {});
  window.addEventListener("touchend", (ev) => {});
  window.addEventListener("load", (ev) => {
    collectEventData({ ...ev, eventType: "window.onload" });
  });
  document.addEventListener("readystatechange", (ev) => {
    if (document.readyState === DocumentReadyState.interactive) {
      collectEventData({ ...ev, eventType: "document.DOMContentLoaded" });
    }
  });
};
