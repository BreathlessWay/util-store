import { getDomPath } from "utils/getDomPath";
import { getDomPathWithIndex } from "utils/getDomPathWithIndex";
import { getRelativePosition } from "utils/getRelativePosition";
import { getDomContent } from "utils/getDomContent";
import { validArrayParams, validFunctionParams } from "utils/validParams";

import { DocumentReadyState, TIME_GAP } from "src/type/constants";

// spa 的 performance 只能检测首屏
const getPerformance = () => {
  if (!window.performance) return;
  const timing = window.performance.timing;
  let pageShowTime: Record<any, any> = {};
  if (timing) {
    pageShowTime = {
      // 重定向耗时
      redirect: timing.redirectEnd - timing.redirectStart,
      // 页面加载耗时
      load: timing.loadEventStart - timing.navigationStart,
      // 页面卸载耗时
      unload: timing.unloadEventEnd - timing.unloadEventStart,
      // dns 查询
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      // tcp 连接
      connect: timing.connectEnd - timing.connectStart,
      // 发起请求到响应
      request: timing.responseStart - timing.requestStart,
      // 响应时间
      response: timing.responseEnd - timing.responseStart,
      //
      content: timing.domContentLoadedEventEnd - timing.domLoading,
      // DOM 渲染耗时
      render: timing.domComplete - timing.domContentLoadedEventEnd,
      // firstbyte：首包时间
      ttfb: timing.responseStart - timing.domainLookupStart,
      // fpt：First Paint Time, 首次渲染时间 / 白屏时间
      fpt: timing.responseEnd - timing.fetchStart,
      // tti：Time to Interact，首次可交互时间
      tti: timing.domInteractive - timing.fetchStart,
      // ready：HTML 加载完成时间，即 DOM 就位的时间
      ready: timing.domContentLoadedEventEnd - timing.fetchStart,
    };
    if (timing.secureConnectionStart) {
      // ssl 解析时间
      pageShowTime.ssl = timing.connectEnd - timing.secureConnectionStart;
    }
  }
  const resource: Record<
    string,
    Array<{
      name: string;
      // 资源加载耗时
      duration: string;
      // 资源大小
      size: number;
      // 资源所用协议
      protocol: string;
    }>
  > = {};
  if (validFunctionParams(window.performance.getEntriesByType)) {
    const resourceInfo = window.performance.getEntriesByType(
      "resource"
    ) as Array<PerformanceResourceTiming>;

    if (resourceInfo && validArrayParams(resourceInfo)) {
      resourceInfo.forEach((item) => {
        resource[item.initiatorType] = resource[item.initiatorType] || [];
        item.name.indexOf(".ico") === -1 &&
          resource[item.initiatorType].push({
            name: item.name,
            duration: item.duration.toFixed(2),
            size: item.transferSize,
            protocol: item.nextHopProtocol,
          });
      });
    }
  }
  return { ...pageShowTime, resource };
};

const listenerWrapFun = <K extends keyof HTMLElementEventMap>(
  type: K,
  listener: (ev: HTMLElementEventMap[K]) => any,
  collectEventData: CollectEventDataType
) => {
  let lastTimer = Date.now();
  return (ev: HTMLElementEventMap[K]) => {
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
    if (type === "load") {
    }
    // 由于我们一般会将静态资源存放在 cdn 等第三方域名上，所以当前业务域名中的 window.onerror 会将这类错误统一展示为 Script error。
    // 浏览器不会对 try-catch 起来的异常进行跨域拦截，所以我们采用劫持原生方法，将原生方法用 try/catch 的函数包裹来处理。
    try {
      return listener.call(this, ev);
    } catch (error) {
      throw error;
    }
  };
};

const getKey = <K extends keyof HTMLElementEventMap>(
  type: K,
  options?: boolean | AddEventListenerOptions | undefined
) => {
  return (
    "__" +
    type +
    "_" +
    (options === true || (options && options.capture) ? "capture" : "bubble") +
    "__"
  );
};

export const proxyUIEvent = (collectEventData: CollectEventDataType) => {
  const originStopPropagation = MouseEvent.prototype.stopPropagation;

  MouseEvent.prototype.stopPropagation = function () {
    console.trace("stopPropagation");
    originStopPropagation.apply(this);
  };

  const originAddEventListener = EventTarget.prototype.addEventListener,
    originRemoveEventListener = EventTarget.prototype.removeEventListener;

  EventTarget.prototype.addEventListener = function <
    K extends keyof HTMLElementEventMap
  >(
    type: K,
    listener: (ev: HTMLElementEventMap[K]) => any,
    options?: boolean | AddEventListenerOptions | undefined
  ): void {
    let listenerWrap;
    const cacheKey = getKey(type, options);
    if ((listener as any)[cacheKey]) {
      listenerWrap = (listener as any)[cacheKey];
    } else {
      listenerWrap = listenerWrapFun(type, listener, collectEventData);
      (listener as any)[cacheKey] = listenerWrap;
    }

    return originAddEventListener.call(
      this,
      type,
      listenerWrap as EventListener,
      options
    );
  };

  EventTarget.prototype.removeEventListener = function <
    K extends keyof HTMLElementEventMap
  >(
    type: K,
    listener: (ev: HTMLElementEventMap[K]) => any,
    options?: boolean | EventListenerOptions
  ): void {
    return originRemoveEventListener.call(
      this,
      type,
      (listener as any)[getKey(type, options)] || listener,
      options
    );
  };

  Object.defineProperty(EventTarget.prototype, "onclick", {
    set(fun) {
      if (validFunctionParams(fun)) {
        this.addEventListener("click", fun);
        this.cacheFun = fun;
      } else {
        this.cacheFun && this.removeEventListener("click", this.cacheFun);
        delete this.cacheFun;
      }
    },
    get() {
      return this.cacheFun;
    },
  });
  Object.defineProperty(EventTarget.prototype, "scroll", {
    set(fun) {
      if (validFunctionParams(fun)) {
        this.addEventListener("click", fun);
        this.cacheFun = fun;
      } else {
        this.cacheFun && this.removeEventListener("scroll", this.cacheFun);
        delete this.cacheFun;
      }
    },
    get() {
      return this.cacheFun;
    },
  });

  window.addEventListener("click", (ev) => {});
  window.addEventListener("scroll", (ev) => {});
  window.addEventListener("touchstart", (ev) => {});
  window.addEventListener("touchend", (ev) => {});
  window.addEventListener("load", (ev) => {
    collectEventData({
      ...ev,
      eventType: "window.onload",
      performance: getPerformance(),
    });
  });
  document.addEventListener("readystatechange", (ev) => {
    if (document.readyState === DocumentReadyState.interactive) {
      collectEventData({ ...ev, eventType: "document.DOMContentLoaded" });
    }
  });
};
