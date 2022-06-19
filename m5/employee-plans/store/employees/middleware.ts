/* eslint no-console: ["error", { allow: ["log", "group", "groupEnd", "info"] }] */
import { MiddlewareAPI, Middleware, Dispatch, Action } from "redux";

export const LoggerMiddleware: Middleware =
  (store: MiddlewareAPI) => (next: Dispatch<Action>) => (action: Action) => {
    console.group(action.type);
    console.info("dispatching", action);
    const result = next(action);
    console.log("next state", store.getState());
    console.groupEnd();
    return result;
  };

export const LocalStorageMiddleware: Middleware =
  (store: MiddlewareAPI) => (next: Dispatch<Action>) => (action: Action) => {
    let result: Action<any>
    if (localStorage.getItem(action.type) === null) {
      window.localStorage.setItem(action.type, JSON.stringify(action));
      result = next(action)
    }else{
      result = next(JSON.parse(localStorage.getItem(action.type)!));
    }
    return result;
  };
