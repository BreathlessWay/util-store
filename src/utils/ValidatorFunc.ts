import { ValidFunName } from "type/constants";

import {
  validArrayParams,
  validNumberParams,
  validObjectParams,
  validRegExpParams,
  validStringParams,
} from "utils/validParams";
import GetType from "utils/GetType";

type ValidatorRuleType = {
  strategy: RegExp | ValidFunName;
  errorMsg: string;
  range?: Array<any>;
  length?: number;
};

export default class ValidatorFunc {
  private validatorList: Array<() => string | undefined | void> = [];

  private [ValidFunName.Required] = (value: any, errorMsg: string) => {
    errorMsg = errorMsg || "参数必填";
    if (
      !GetType.isNull(value) &&
      !GetType.isUndefined(value) &&
      (validStringParams(value) ||
        validObjectParams(value) ||
        validArrayParams(value))
    ) {
      return "";
    }
    return errorMsg;
  };

  private [ValidFunName.IsValidUrl] = (value: any, errorMsg: string) => {
    errorMsg = errorMsg || `参数不是正确的url`;
    const urlReg =
      /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;
    if (urlReg.test(value)) {
      return "";
    }
    return errorMsg;
  };

  private [ValidFunName.IsValidEmail] = (value: any, errorMsg: string) => {
    errorMsg = errorMsg || `参数不是正确的email`;
    const urlReg = /^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    if (urlReg.test(value)) {
      return "";
    }
    return errorMsg;
  };

  private [ValidFunName.IsValidPhoneNumber] = (
    value: any,
    errorMsg: string
  ) => {
    errorMsg = errorMsg || `参数不是正确的手机号码`;
    const urlReg = /^(13[0-9]|14[5|7]|15[\d]|18[\d])\d{8}$/;
    if (urlReg.test(value)) {
      return "";
    }
    return errorMsg;
  };

  private [ValidFunName.IsValidIdCardNumber] = (
    value: any,
    errorMsg: string
  ) => {
    errorMsg = errorMsg || `参数不是正确的身份证号码`;
    //15位和18位身份证号码的正则表达式
    const regIdCard =
      /^(^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$)|(^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])((\d{4})|\d{3}[Xx])$)$/;
    //如果通过该验证，说明身份证格式正确，但准确性还需计算
    if (regIdCard.test(value)) {
      if (value.length == 18) {
        let idCardWi = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2], //将前17位加权因子保存在数组里
          idCardY = [1, 0, 10, 9, 8, 7, 6, 5, 4, 3, 2], //这是除以11后，可能产生的11位余数、验证码，也保存成数组
          idCardWiSum = 0; //用来保存前17位各自乖以加权因子后的总和
        for (let i = 0; i < 17; i++) {
          idCardWiSum += value.substring(i, i + 1) * idCardWi[i];
        }
        let idCardMod = idCardWiSum % 11, //计算出校验码所在数组的位置
          idCardLast = value.substring(17); //得到最后一位身份证号码
        //如果等于2，则说明校验码是10，身份证号码最后一位应该是X
        if (idCardMod == 2) {
          if (idCardLast == "X" || idCardLast == "x") {
            return "";
          } else {
            return errorMsg;
          }
        } else {
          //用计算出的验证码与最后一位身份证号码匹配，如果一致，说明通过，否则是无效的身份证号码
          if (idCardLast == idCardY[idCardMod]) {
            return "";
          } else {
            return errorMsg;
          }
        }
      }
    } else {
      return errorMsg;
    }
  };

  private [ValidFunName.MinLength] = (
    value: any,
    length: number,
    errorMsg: string
  ) => {
    errorMsg = errorMsg || `参数长度不能小于${length}`;
    if (value && (value as any).length > length) {
      return "";
    }
    return errorMsg;
  };

  private [ValidFunName.MaxLength] = (
    value: any,
    length: number,
    errorMsg: string
  ) => {
    errorMsg = errorMsg || `参数长度超过${length}`;
    if (value && (value as any).length < length) {
      return "";
    }
    return errorMsg;
  };

  private [ValidFunName.InEnumRange] = (
    value: any,
    range: Array<any>,
    errorMsg: string
  ) => {
    errorMsg = errorMsg || `参数必须在${range.join(",")}内`;
    if (~range.indexOf(value)) {
      return "";
    }
    return errorMsg;
  };

  private [ValidFunName.IsPatternMatch] = (
    value: any,
    pattern: RegExp,
    errorMsg: string
  ) => {
    errorMsg = errorMsg || `参数未能匹配正则`;
    if (pattern.test(value)) {
      return "";
    }
    return errorMsg;
  };

  add = (value: any, rules: Array<ValidatorRuleType>) => {
    try {
      if (!validArrayParams(rules)) {
        throw new Error("校验规则参数错误");
      }

      rules.forEach((rule, index) => {
        if (!validObjectParams(rule)) {
          console.warn(`第 ${index} 个校验规则为空，将被跳过`);
          return;
        }
        const { strategy, errorMsg } = rule;

        switch (true) {
          case validRegExpParams(strategy): {
            this.validatorList.push(() =>
              this[ValidFunName.IsPatternMatch](
                value,
                strategy as RegExp,
                errorMsg
              )
            );
            return;
          }
          case strategy === ValidFunName.MaxLength:
          case strategy === ValidFunName.MinLength: {
            const { length } = rule;
            if (!validNumberParams(length)) {
              console.warn(
                `第 ${index} 个校验规则 length 属性 ${length} 错误，将被跳过`
              );
              return;
            }
            this.validatorList.push(() =>
              this[strategy as ValidFunName.MaxLength](
                value,
                length as number,
                errorMsg
              )
            );
            return;
          }
          case strategy === ValidFunName.InEnumRange: {
            const { range } = rule;
            if (!validArrayParams(range)) {
              console.warn(
                `第 ${index} 个校验规则 range 属性 ${range} 错误，将被跳过`
              );
              return;
            }
            this.validatorList.push(() =>
              this[strategy as ValidFunName.InEnumRange](
                value,
                range as Array<any>,
                errorMsg
              )
            );
            return;
          }
          case strategy === ValidFunName.IsValidUrl:
          case strategy === ValidFunName.IsValidEmail:
          case strategy === ValidFunName.IsValidPhoneNumber:
          case strategy === ValidFunName.IsValidIdCardNumber:
          case strategy === ValidFunName.Required: {
            this.validatorList.push(() =>
              this[strategy as ValidFunName.IsValidUrl](value, errorMsg)
            );
            return;
          }
          default: {
            console.warn(
              `第 ${index} 个校验规则 ${strategy} 非预置规则，将被跳过`
            );
          }
        }
      });
    } catch (e) {
      console.warn(e.message);
    }
  };

  reset = () => {
    this.validatorList = [];
  };

  valid = () => {
    let isValid = true;
    this.validatorList.forEach((_) => {
      const errorMessage = _();
      if (errorMessage) {
        isValid = false;
        console.error(errorMessage);
      }
    });
    return isValid;
  };
}
