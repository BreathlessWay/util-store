import { ParamType } from "src/type/hepler";

export const proxyRouteEvent = (collectEventData: Function) => {
  const originPushStateMethod = window.history.pushState,
    originReplaceStateMethod = window.history.replaceState;

  window.history.pushState = function () {
    collectEventData(arguments);
    return originPushStateMethod.apply(
      this,
      arguments as unknown as ParamType<typeof originPushStateMethod>
    );
  };
  window.history.replaceState = function () {
    collectEventData(arguments);
    return originReplaceStateMethod.apply(
      this,
      arguments as unknown as ParamType<typeof originReplaceStateMethod>
    );
  };
  // history.go history.forward 会触发 popstate
  // 所以 hashchange 也会触发 popstate
  window.addEventListener(
    "popstate",
    (...args) => {
      collectEventData(args);
    },
    false
  );

  Object.defineProperty(window, "onpopstate", {
    set(fun) {
      this.addEventListener("popstate", fun);
    },
  });
};
