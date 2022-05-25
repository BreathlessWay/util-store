import { proxyUIEvent } from "EventSource/proxyUIEvent";
import { proxyPageLifecycleEvent } from "EventSource/proxyPageLifecycleEvent";
import { proxyErrorEvent } from "EventSource/proxyErrorEvent";
import { proxySocketEvent } from "EventSource/proxySocketEvent";

import CookieHandler from "utils/CookieHandler";
import EventBus from "utils/EventBus";
import GetType from "utils/GetType";
import ValidatorFunc from "utils/ValidatorFunc";
import { DateFormat } from "utils/DateFormat";
import * as validParams from "utils/validParams";

export default {
  proxyUIEvent,
  proxyPageLifecycleEvent,
  proxyErrorEvent,
  proxySocketEvent,
  CookieHandler,
  EventBus,
  GetType,
  ValidatorFunc,
  DateFormat,
  ...validParams,
};
