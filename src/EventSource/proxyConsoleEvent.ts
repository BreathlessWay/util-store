export const proxyConsoleEvent = (collectEventData: CollectEventDataType) => {
  const consoleLevelArray = ["log", "warn", "error"];

  consoleLevelArray.forEach((_) => {
    // @ts-ignore
    const originConsole = console[_];
    // @ts-ignore
    console[_] = function () {
      collectEventData({
        message: [...arguments].join(","),
        eventType: `console.${_}`,
      });
      originConsole.apply(this, arguments);
    };
  });
};
