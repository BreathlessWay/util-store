interface Event {
  path: Array<Element>;
}

interface Function {
  before: <T extends Array<any>, P>(params: Function) => (...args: T) => P;
  after: <T extends Array<any>, P>(params: Function) => (...args: T) => P;
}

interface SocketReportData {
  method: string;
  url: string;
  requestHeader: Record<any, any>;
  start: number;
  body?: Document | BodyInit | null;
  responseHeader: Record<any, any>;
  type: "xhr" | "fetch";
  duration: number;
  status: number;
  responseType: string;
  responseURL: string;
  statusText: string;
  timeout?: number;
  withCredentials?: boolean;
}

interface XMLHttpRequest {
  memorizedCurrentRequest: Pick<
    SocketReportData,
    "method" | "url" | "requestHeader" | "start" | "body"
  >;
}
