import { proxyClickEvent } from "EventSource/proxyClickEvent";
import { proxyRouteEvent } from "EventSource/proxyRouteEvent";
import CookieHandler from "utils/CookieHandler";
import EventBus from "utils/EventBus";
import GetType from "utils/GetType";
import ValidatorFunc from "utils/validatorFunc";
import * as validParams from "utils/validParams";

export default {
  proxyClickEvent,
  proxyRouteEvent,
  CookieHandler,
  EventBus,
  GetType,
  ValidatorFunc,
  ...validParams,
};
