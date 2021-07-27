import { ParamType } from "type/hepler";
import { validObjectParams } from "utils/validParams";

const transformHeaderToMap = (header: string) => {
  const headerMap: Record<string, any> = {};
  try {
    if (header) {
      const headerArray = header.split("\r\n");
      headerArray.forEach((item) => {
        const [key, value] = item.split(": ");
        if (key) {
          headerMap[key] = value;
        }
      });
    }
  } catch (e) {}
  return headerMap;
};

async function reportAjaxData(
  this: XMLHttpRequest,
  reportData: SocketReportData,
  collectEventData: Function
) {
  let result: any;
  // An empty responseType string is the same as "text", the default type.
  if (this.responseType === "text" || this.responseType === "") {
    try {
      result = JSON.parse(this.responseText);
    } catch (e) {
      result = this.responseText;
    }
    return collectEventData({ ...reportData, result });
  }
  if (this.responseType === "document") {
    result = this.responseXML;
    return collectEventData({ ...reportData, result });
  }
  if (this.responseType === "json") {
    try {
      if (typeof this.response === "string") {
        result = JSON.parse(this.response);
      }
      if (this.response && typeof this.response === "object") {
        result = this.response;
      }
    } catch (e) {
      result = this.response;
    }
    return collectEventData({ ...reportData, result });
  }
  if (this.responseType === "blob") {
    try {
      result = await this.response.text();
    } catch (e) {
      result = this.response;
    }
    return collectEventData({ ...reportData, result });
  }
  if (this.responseType === "arraybuffer") {
    result = this.response;
    return collectEventData({ ...reportData, result });
  }
}

const proxyAjaxEvent = (collectEventData: Function) => {
  const originAbort = XMLHttpRequest.prototype.abort,
    originGetAllResponseHeaders =
      XMLHttpRequest.prototype.getAllResponseHeaders,
    originGetResponseHeader = XMLHttpRequest.prototype.getResponseHeader,
    originOpen = XMLHttpRequest.prototype.open,
    originOverrideMimeType = XMLHttpRequest.prototype.overrideMimeType,
    originSend = XMLHttpRequest.prototype.send,
    originSetRequestHeader = XMLHttpRequest.prototype.setRequestHeader;

  XMLHttpRequest.prototype.getAllResponseHeaders = function () {
    console.log("getAllResponseHeaders");
    return originGetAllResponseHeaders.apply(this);
  };

  XMLHttpRequest.prototype.overrideMimeType = function (mime: string) {
    console.log("overrideMimeType", mime);
    return originOverrideMimeType.call(this, mime);
  };

  XMLHttpRequest.prototype.open = function (method: string, url: string) {
    this.memorizedCurrentRequest = {
      requestHeader: {},
    } as XMLHttpRequest["memorizedCurrentRequest"];
    this.memorizedCurrentRequest.method = method.toUpperCase();
    this.memorizedCurrentRequest.url = url;
    this.memorizedCurrentRequest.start = Date.now();
    return originOpen.apply(
      this,
      arguments as unknown as ParamType<typeof originOpen>
    );
  };

  XMLHttpRequest.prototype.setRequestHeader = function (
    name: string,
    value: string
  ) {
    if (name) {
      this.memorizedCurrentRequest.requestHeader[name] = value;
    }
    return originSetRequestHeader.call(this, name, value);
  };

  XMLHttpRequest.prototype.send = function (body?: Document | BodyInit | null) {
    this.memorizedCurrentRequest.body = body;
    ((memorizedCurrentRequest) => {
      this.addEventListener("readystatechange", async () => {
        const responseHeader = transformHeaderToMap(
          this.getAllResponseHeaders()
        );
        if (this.readyState === 4) {
          const reportData: SocketReportData = {
            ...memorizedCurrentRequest,
            responseHeader,
            type: "xhr",
            duration: Date.now() - memorizedCurrentRequest.start,
            status: this.status,
            responseType: this.responseType,
            responseURL: this.responseURL,
            statusText: this.statusText,
            timeout: this.timeout,
            withCredentials: this.withCredentials,
          };
          await reportAjaxData.call(this, reportData, collectEventData);
          if (this.status === 200 || this.status === 0) {
            console.log("double listen result");
          } else {
            console.log("double listen");
          }
        }
      });
    })(this.memorizedCurrentRequest);
    return originSend.apply(
      this,
      arguments as unknown as ParamType<typeof originSend>
    );
  };

  XMLHttpRequest.prototype.abort = function () {
    console.log("abort");
    return originAbort.apply(this);
  };

  XMLHttpRequest.prototype.getResponseHeader = function (name: string) {
    console.log("getResponseHeader", name);
    return originGetResponseHeader.call(this, name);
  };
};

const reportFetchData = async (
  response: Response,
  reportData: SocketReportData,
  collectEventData: Function
) => {
  let result;
  // response 是个 Stream 对象只能读取一次，读取完就没了。这意味着，读取方法，只能使用一个，否则会报错。
  try {
    result = await response.clone().text();
    return collectEventData({ ...reportData, result });
  } catch (e) {}

  try {
    result = await response.clone().json();
    return collectEventData({ ...reportData, result });
  } catch (e) {}

  try {
    result = await response.clone().formData();
    return collectEventData({ ...reportData, result });
  } catch (e) {}

  try {
    result = await response.clone().blob();
    return collectEventData({ ...reportData, result });
  } catch (e) {}

  try {
    result = await response.clone().arrayBuffer();
    return collectEventData({ ...reportData, result });
  } catch (e) {}
};

const proxyFetchEvent = (collectEventData: Function) => {
  const originFetch = window.fetch;

  window.fetch = async function (...args) {
    const start = Date.now(),
      [requestInfo, requestInit] = args;
    let requestParams: Request;
    // 一个 Request 实例
    if (requestInfo instanceof Request) {
      requestParams = requestInfo;
    }
    if (typeof requestInfo === "string") {
      requestParams = new Request(requestInfo);
    }
    let {
      url,
      method,
      headers,
      body,
      mode,
      credentials,
      cache,
      redirect,
      referrer,
      referrerPolicy,
      integrity,
    } = requestParams!;
    if (validObjectParams(requestInit)) {
      method = requestInit!.method || method;
      headers = (requestInit!.headers || headers) as Request["headers"];
      body = (requestInit!.body || body) as Request["body"];
      mode = requestInit!.mode || mode;
      credentials = requestInit!.credentials || credentials;
      cache = requestInit!.cache || cache;
      redirect = requestInit!.redirect || redirect;
      referrer = requestInit!.referrer || referrer;
      referrerPolicy = requestInit!.referrerPolicy || referrerPolicy;
      integrity = requestInit!.integrity || integrity;
    }
    const fetchData: XMLHttpRequest["memorizedCurrentRequest"] = {
      start,
      requestHeader: headers,
      method: method.toUpperCase(),
      url,
      body,
    };
    try {
      const response = await originFetch.apply(this, args),
        responseHeader: Record<any, any> = {};
      response.headers.forEach((header, key) => {
        responseHeader[key] = header;
      });
      const reportData: SocketReportData = {
        ...fetchData,
        responseHeader,
        type: "fetch",
        duration: Date.now() - fetchData.start,
        status: response.status,
        responseType: response.type,
        responseURL: response.url,
        statusText: response.statusText,
      };
      await reportFetchData(response, reportData, collectEventData);
      return response;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };
};

const proxyWebsocketEvent = () => {};

export const proxySocketEvent = (collectEventData: Function) => {
  proxyAjaxEvent(collectEventData);
  proxyFetchEvent(collectEventData);
};
