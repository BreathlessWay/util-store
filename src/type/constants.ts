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

export const TIMESTAMP_LENGTH = 13;

export const MAX_ERROR_COLLECT = 6;
