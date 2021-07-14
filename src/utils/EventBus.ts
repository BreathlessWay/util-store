import {
  validArrayParams,
  validFunctionParams,
  validStringParams,
} from "utils/validParams";

class EventBus {
  constructor(prefix?: string) {
    this.prefix = prefix!;
  }

  private readonly prefix: string = "";

  private listenMap: Record<string, Array<Function>> = {};

  hasKey = (key: string) => {
    return this.listenMap.hasOwnProperty(key);
  };

  on = (key: string, fun: Function) => {
    if (!validStringParams(key)) {
      console.error("缺少注册事件名称");
      return;
    }
    key = this.prefix + key;
    if (validFunctionParams(fun)) {
      if (!this.hasKey(key)) {
        this.listenMap[key] = [];
      }
      this.listenMap[key].push(fun);
    } else {
      console.error("注册事件方法错误");
    }
  };

  trigger = (key: string, ...args: Array<any>) => {
    if (!validStringParams(key)) {
      console.error("缺少触发事件名称");
      return;
    }
    key = this.prefix + key;
    const listenList = this.listenMap[key];
    if (!validArrayParams(listenList)) {
      listenList.forEach((listen) => {
        listen.apply(this, args);
      });
    } else {
      console.error("尚未注册该事件");
    }
  };

  off = (key: string, fun: Function) => {
    if (!validStringParams(key)) {
      console.error("缺少取消事件名称");
      return;
    }
    key = this.prefix + key;
    if (validFunctionParams(fun)) {
      let listenList = this.listenMap[key];
      if (validArrayParams(listenList)) {
        let _index = listenList.indexOf(fun);
        while (_index > -1) {
          listenList.splice(_index, 1);
          _index = listenList.indexOf(fun);
        }
        if (!listenList.length) {
          delete this.listenMap[key];
        } else {
          this.listenMap[key] = listenList;
        }
      }
    } else {
      delete this.listenMap[key];
    }
  };

  once = (key: string, fun: Function) => {
    if (!validStringParams(key)) {
      console.error("缺少注册事件名称");
      return;
    }
    key = this.prefix + key;

    if (validFunctionParams(fun)) {
      const wrapFun = (...args: Array<any>) => {
        fun.apply(this, args);
        this.off(key, wrapFun);
      };
      if (!this.hasKey(key)) {
        this.listenMap[key] = [];
      }
      this.listenMap[key].push(wrapFun);
    } else {
      console.error("注册事件方法错误");
    }
  };

  clear = () => {
    this.listenMap = {};
  };
}

export default EventBus;
