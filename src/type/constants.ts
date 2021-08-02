export enum ValidFunName {
  Required = "required",
  MinLength = "minLength",
  MaxLength = "maxLength",
  InEnumRange = "inEnumRange",
  IsValidUrl = "isValidUrl",
  IsValidEmail = "isValidEmail",
  IsValidPhoneNumber = "isValidPhoneNumber",
  IsValidIdCardNumber = "isValidIdCardNumber",
  IsPatternMatch = "isPatternMatch",
}

export enum JavascriptErrorType {
  SyntaxError = "SyntaxError", // window.onerror捕获不到SyntaxError，一般SyntaxError在构建阶段，甚至本地开发阶段就会被发现。
  TypeError = "TypeError", // 值不是所期待的类型
  ReferenceError = "ReferenceError", // 引用未声明的变量
  RangeError = "RangeError", // 当一个值不在其所允许的范围或者集合中
  ResourceError = "ResourceError", // 资源加载错误  window.onerror捕获不到 ResourceError
  HttpError = "HttpError", // Http请求错误
}

export enum DocumentReadyState {
  loading = "loading", // 文档仍然在加载
  interactive = "interactive", // 档结束加载并且被解析，但是想图片，样式，frame之类的子资源仍在加载
  complete = "complete", // 文档和子资源已经结束加载，该状态表明将要触发load事件。
}

export const TIMESTAMP_LENGTH = 13;

export const MAX_ERROR_COLLECT = 6;

export const TIME_GAP = 200;
