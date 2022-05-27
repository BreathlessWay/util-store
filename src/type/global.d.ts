interface Event {
  path: Array<Element>;
}

interface Function {
  before: <T extends Array<any>, P>(params: Function) => (...args: T) => P;
  after: <T extends Array<any>, P>(params: Function) => (...args: T) => P;
}

interface XMLHttpRequest {
  memorizedCurrentRequest: Pick<
    SocketReportData,
    "method" | "url" | "requestHeader" | "start" | "body"
  >;
}
