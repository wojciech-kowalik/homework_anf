import { sendTokenCode, TokenInstruction } from "api/token";
import {
  getLimits,
  LimitsSettings,
  sendLimitsUpdate,
  SendLimitsUpdatePayload,
} from "api/limits";

import { MoneyLimitType } from "api/types";

import { assign, createMachine, TransitionsConfig } from "xstate";
import { ChangeLimitsContext, ChangeLimitsEvent } from "./types";

export const ChangeLimitsMachine = createMachine<
  ChangeLimitsContext,
  ChangeLimitsEvent
>(
  {
    id: "ChangeLimits",
    initial: "loadingLimitsData",
    context: {
      error: false,
    },
    states: {
      failure: {
        type: "final",
      },
      showLimits: {
        on: {
          CHOOSE_DAILY_LIMIT: {
            actions: assign({
              limitType: "DAILY" as MoneyLimitType,
            }),
            target: "changeLimitsAmountForm",
          },
          CHOOSE_MONTHLY_LIMIT: {
            actions: assign({
              limitType: "MONTHLY" as MoneyLimitType,
            }),
            target: "changeLimitsAmountForm",
          },
          CHOOSE_VERIFICATION_METHOD: "changeVerificationMethodForm",
        } as TransitionsConfig<ChangeLimitsContext, ChangeLimitsEvent>,
      },
      changeLimitsAmountForm: {
        on: {
          CANCEL_CHOICE: "loadingLimitsData",
          SUBMIT_LIMIT: "submittingLimitData",
        },
      },
      changeVerificationMethodForm: {
        on: {
          CANCEL_CHOICE: "loadingLimitsData",
          SUBMIT_VERIFICATION_METHOD: "submittingLimitData",
        },
      },
      limitsTokenForm: {
        on: {
          CANCEL_CHOICE: "loadingLimitsData",
          SUBMIT_TOKEN: "submittingToken",
          RESET_TOKEN: "submittingLimitData",
        },
      },
      loadingLimitsData: {
        invoke: {
          id: "getLimits",
          src: "getLimits",
          onDone: {
            target: "showLimits",
            actions: assign({
              settings: (context, event) => event.data as LimitsSettings,
            }),
          },
          onError: "failure",
        },
      },
      submittingLimitData: {
        invoke: {
          id: "sendLimitsUpdate",
          src: "sendLimitsUpdate",
          onDone: {
            target: "limitsTokenForm",
            actions: assign({
              settings: (context, event) =>
                event.data.settings as LimitsSettings,
              tokenInstruction: (context, event) =>
                event.data.token as TokenInstruction,
            }),
          },
          onError: [
            {
              cond: (context, { data }) => {
                return data?.response?.status === 401;
              },
              actions: assign({ error: (context, event) => true }),
              target: "loadingLimitsData",
            },
            {
              target: "failure",
            },
          ],
        },
      },
      submittingToken: {
        invoke: {
          id: "sendTokenCode",
          src: "sendTokenCode",
          onDone: {
            target: "loadingLimitsData",
            actions: assign({ error: (context, event) => false }),
          },
          onError: [
            {
              cond: (context, { data }) => {
                return data?.response?.status === 401;
              },
              actions: assign({ error: (context, event) => true }),
              target: "limitsTokenForm",
            },
            {
              target: "failure",
            },
          ],
        },
      },
    },
  },
  {
    services: {
      getLimits: (context, event) => getLimits(),
      sendTokenCode: (context, { password }: any) =>
        sendTokenCode({
          tokenId: context.tokenInstruction!.tokenId,
          tokenCode: password,
        }),
      sendLimitsUpdate: (context, { limit }: any) => {
        let limitTypeData = {
          verificationMethod: limit,
        } as SendLimitsUpdatePayload;
        if (context.limitType === "DAILY") {
          limitTypeData = { dailyLimit: limit } as SendLimitsUpdatePayload;
        }
        if (context.limitType === "MONTHLY") {
          limitTypeData = {
            monthlyLimit: limit,
          } as SendLimitsUpdatePayload;
        }

        return sendLimitsUpdate(limitTypeData);
      },
    },
  }
);
