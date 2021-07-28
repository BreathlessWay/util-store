import { getErrorKey } from "utils/getErrorKey";

import { MAX_ERROR_COLLECT } from "type/constants";

const errorCountMap = new Map();

export const proxyErrorEvent = (collectEventData: Function) => {
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
      const { error, lineno, colno } = errorEvent;
      const errorKey = getErrorKey(error.message, lineno + "" + colno),
        errorCount = errorCountMap.get(errorKey);
      // 相同错误只上报 MAX_ERROR_COLLECT 次
      if (errorCount === 0) {
        return;
      }
      errorCountMap.set(errorKey, (errorCount || MAX_ERROR_COLLECT) - 1);

      collectEventData(errorEvent);
    },
    true
  );

  window.addEventListener("unhandledrejection", (promiseRejectionEvent) => {
    // promiseRejectionEvent.preventDefault(); // 去掉控制台的异常显示
    collectEventData(promiseRejectionEvent);
  });
};
