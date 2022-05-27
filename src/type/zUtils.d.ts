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

type CollectEventDataType = (
  data: Record<any, any> & { eventType: string }
) => void;
