import { proxyUIEvent } from "EventSource/proxyUIEvent";
import { proxyRouteEvent } from "EventSource/proxyRouteEvent";
import { proxyErrorEvent } from "EventSource/proxyErrorEvent";
import { proxySocketEvent } from "EventSource/proxySocketEvent";

import CookieHandler from "utils/CookieHandler";
import EventBus from "utils/EventBus";
import GetType from "utils/GetType";
import ValidatorFunc from "utils/ValidatorFunc";
import * as validParams from "utils/validParams";

export default {
  proxyUIEvent,
  proxyRouteEvent,
  proxyErrorEvent,
  proxySocketEvent,
  CookieHandler,
  EventBus,
  GetType,
  ValidatorFunc,
  ...validParams,
};
