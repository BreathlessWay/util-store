# zUtils

> 使用方式

```
// 安装模块
npm i @breathlessway/zutils -S

// 使用模块

import { GetType } from '@breathlessway/zutils'

GetType.isDate('')
```

> 一个常用工具函数的集合

```js
// cookie处理方法
export { default as CookieHandler } from "utils/CookieHandler";
// 日期格式化方法
export { default as DateFormat } from "utils/DateFormat";
// eventbus
export { default as EventBus } from "utils/EventBus";
// 策略模式表单验证
export { default as ValidatorFunc } from "utils/ValidatorFunc";
// 验证数据类型
export { default as GetType } from "utils/GetType";
// 验证函数参数
export {
validStringParams,
validFunctionParams,
validArrayParams,
validObjectParams,
validObjectInstanceType,
validRegExpParams,
validNumberParams,
} from "utils/validParams";
```
