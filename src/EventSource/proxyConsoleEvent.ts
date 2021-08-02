export const proxyConsoleEvent = (collectEventData: CollectEventDataType) => {
  const consoleLevelArray: Array<keyof Console> = ["log", "warn", "error"];

  consoleLevelArray.forEach((_) => {
    const originConsole = console[_];
    console[_] = function () {
      collectEventData({
        message: [...arguments].join(","),
        eventType: `console.${_}`,
      });
      originConsole.apply(this, arguments);
    };
  });
};
