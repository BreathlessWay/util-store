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
  window.addEventListener(
    "popstate",
    (...args) => {
      collectEventData(args);
    },
    false
  );
  window.addEventListener(
    "hashchange",
    (...args) => {
      collectEventData(args);
    },
    false
  );
};
