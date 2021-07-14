import getType from "./GetType";

export const validStringParams = (params: any) => {
  return params && getType.isString(params) && params.trim();
};

export const validFunctionParams = (params: any) => {
  return params && getType.isFunction(params);
};

export const validArrayParams = (params: any) => {
  return params && getType.isArray(params) && params.length > 0;
};

export const validObjectParams = (params: any) => {
  return params && getType.isObject(params) && Object.keys(params).length > 0;
};
