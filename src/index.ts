import * as proxyClickEvent from "proxyEvent/proxyClickEvent";
import { proxyRouteEvent } from "proxyEvent/proxyRouteEvent";
import CookieHandler from "utils/CookieHandler";
import EventBus from "utils/EventBus";
import { generateNormalId, generateUUID } from "utils/generateId";
import { getDomPath } from "utils/getDomPath";
import { getDomPathWithIndex } from "utils/getDomPathWithIndex";
import { getTimestamp } from "utils/getTimestamp";
import GetType from "utils/GetType";
import ValidatorFunc from "utils/validatorFunc";
import * as validParams from "utils/validParams";

export default {
  ...proxyClickEvent,
  proxyRouteEvent,
  CookieHandler,
  EventBus,
  generateUUID,
  generateNormalId,
  getDomPath,
  getDomPathWithIndex,
  getTimestamp,
  GetType,
  ValidatorFunc,
  ...validParams,
};
