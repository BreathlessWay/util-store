import { getErrorKey } from "utils/getErrorKey";

import { MAX_ERROR_COLLECT } from "type/constants";

const errorCountMap = new Map();

export const proxyErrorEvent = (collectEventData: CollectEventDataType) => {
  // window.onerror = function (event, source, lineno, colno, error) {
  //   // 返回 true 的时候，异常才不会向上抛出，控制台不会显示
  //   return true;
  // };

  // 监听js运行时错误事件，会比window.onerror先触发
  // 由于网络请求异常不会事件冒泡，因此必须在捕获阶段将其捕捉到才行
  // true - 事件句柄在捕获阶段执行
  // false - 默认。事件句柄在冒泡阶段执行
  window.addEventListener(
    "error",
    (errorEvent) => {
      if (errorEvent.error) {
        const { error, lineno, colno, message } = errorEvent;
        let stack = error.stack
          .replace(/\n/gi, "")
          .split(/\bat\b/)
          .slice(0, 9)
          .join("@")
          .replace(/\?[^:]+/gi, "");
        const msg = error.toString();
        if (stack.indexOf(msg) < 0) {
          stack = msg + "@" + stack;
        }
        const errorKey = getErrorKey(message, lineno + "" + colno),
          errorCount = errorCountMap.get(errorKey);
        // 相同错误只上报 MAX_ERROR_COLLECT 次
        if (errorCount === 0) {
          return;
        }
        errorCountMap.set(errorKey, (errorCount || MAX_ERROR_COLLECT) - 1);
        collectEventData({
          ...errorEvent,
          eventType: "window.script-error",
          stack,
        });
      } else {
        const targetNode = errorEvent.target as HTMLElement,
          errorSource =
            (targetNode as HTMLLinkElement).href ||
            (targetNode as HTMLScriptElement).src;
        collectEventData({
          tagName: targetNode.localName,
          eventType: "window.source-onerror",
          source: errorSource,
        });
      }
    },
    true
  );

  window.addEventListener("unhandledrejection", (promiseRejectionEvent) => {
    // promiseRejectionEvent.preventDefault(); // 去掉控制台的异常显示
    collectEventData({
      ...promiseRejectionEvent,
      eventType: "window.unhandledrejection",
    });
  });
};
