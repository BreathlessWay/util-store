import lifecycle from "page-lifecycle";

import { ParamType } from "src/type/hepler";

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
    collectEventData({ data, title, url, eventType: "history.pushState" });
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
    collectEventData({ data, title, url, eventType: "history.replaceState" });
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
      collectEventData({ ...ev, eventType: "history.popstate" });
    },
    false
  );

  Object.defineProperty(window, "onpopstate", {
    set(fun) {
      this.addEventListener("popstate", fun);
    },
  });

  lifecycle.addEventListener("statechange", (event) => {
    collectEventData({
      ...event.originalEvent,
      eventType: `lifecycle.${event.newState}`,
    });
  });
};
