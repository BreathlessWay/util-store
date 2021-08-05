import lifecycle from "page-lifecycle";

import { ParamType } from "src/type/hepler";
import { validFunctionParams } from "utils/validParams";

export const proxyPageLifecycleEvent = (
  collectEventData: CollectEventDataType
) => {
  const originPushStateMethod = window.history.pushState,
    originReplaceStateMethod = window.history.replaceState;

  window.history.pushState = function (
    data: any,
    title: string,
    url?: string | null
  ) {
    collectEventData({
      data,
      title,
      url,
      eventType: "history.pushState",
      lastTime: Date.now(),
    });
    return originPushStateMethod.apply(
      this,
      arguments as unknown as ParamType<typeof originPushStateMethod>
    );
  };
  window.history.replaceState = function (
    data: any,
    title: string,
    url?: string | null
  ) {
    collectEventData({
      data,
      title,
      url,
      eventType: "history.replaceState",
      lastTime: Date.now(),
    });
    return originReplaceStateMethod.apply(
      this,
      arguments as unknown as ParamType<typeof originReplaceStateMethod>
    );
  };
  // history.go history.forward 会触发 popstate
  // 所以 hashchange 也会触发 popstate
  window.addEventListener(
    "popstate",
    (ev) => {
      collectEventData({
        ...ev,
        eventType: "history.popstate",
        lastTime: Date.now(),
      });
    },
    false
  );

  Object.defineProperty(window, "onpopstate", {
    set(fun) {
      this.cacheFun = fun;
      if (validFunctionParams(fun)) {
        this.addEventListener("popstate", fun);
      }
    },
    get() {
      return this.cacheFun;
    },
  });

  lifecycle.addEventListener("statechange", (event) => {
    collectEventData({
      ...event.originalEvent,
      eventType: `lifecycle.${event.newState}`,
    });
  });
};
