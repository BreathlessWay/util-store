export default class ValidatorFunc {
  constructor() {}

  private isNotEmpty = <T>(value: T, errorMsg: string) => {};

  private required = <T>(value: T, errorMsg: string) => {};

  private minLength = <T>(value: T, length: number, errorMsg: string) => {};

  private maxLength = <T>(value: T, length: number, errorMsg: string) => {};

  private inEnumRange = <T>(value: T, range: Array<T>, errorMsg: string) => {};

  private isValidUrl = <T>(value: T, errorMsg: string) => {};

  private patternValid = <T>(value: T, pattern: RegExp, errorMsg: string) => {};

  add = <T, P>(
    value: T,
    rules: Array<{
      strategy: string | RegExp;
      errorMsg: string;
    }>
  ) => {};

  valid = () => {};
}
