# [visualizer demo](https://xstate.js.org/viz/?gist=a8c4eb85a598d5b98d2e65b9c62ec99f)

```js
const delay = (time) => {
  return new Promise((res, rej) => {
    setTimeout(res, time);
  });
};

const getLimits = async () => {
  await delay(1500);
  return {
    availableDailyAmount: 123,
    availableMonthlyAmount: 4334,
    verificationMethod: null,
  };
};

const sendLimitsUpdate = async (params) => {
  await delay(1500);
  return {
    tokenInstruction: {
      instruction: "Wpisz hasło SMS",
      tokenId: "1111-2222-3333-4444",
    },
    settings: {
      availableDailyAmount: 123,
      availableMonthlyAmount: 4334,
      verificationMethod: null,
      dailyAmount: 234,
      monthlyAmount: 5334,
    },
  };
};

const sendTokenCode = async (params) => {
  await delay(1500);
  if (params.tokenCode.length !== 4) {
    throw new Error(`Invalid confirmation token!`);
  }
};

Machine({
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
            limitType: "DAILY",
          }),
          target: "changeLimitsAmountForm",
        },
        CHOOSE_MONTHLY_LIMIT: {
          actions: assign({
            limitType: "MONTHLY",
          }),
          target: "changeLimitsAmountForm",
        },
        CHOOSE_VERIFICATION_METHOD: "changeVerificationMethodForm",
      },
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
            settings: (context, event) => event.data,
          }),
        },
        onError: "failure",
      },
    },
    submittingLimitData: {
      invoke: {
        id: "sendLimitsUpdate",
        src: "sendLimitsUpdate",
        src: (context, { limit }) => sendLimitsUpdate(limit),
        onDone: {
          target: "limitsTokenForm",
          actions: assign({
            settings: (context, event) => event.data.settings,
            tokenInstruction: (context, event) => event.data.token,
          }),
        },
        onError: {
          target: "failure",
        },
      },
    },
    submittingToken: {
      invoke: {
        id: "sendTokenCode",
        src: (context, { password }) =>
          sendTokenCode({
            tokenId: context.tokenInstruction.tokenId,
            tokenCode: password,
          }),
        onDone: {
          target: "loadingLimitsData",
          actions: assign({ error: (context, event) => false }),
        },
        onError: {
          target: "limitsTokenForm",
          actions: assign({ error: (context, event) => true }),
        },
      },
    },
    submittingLimitData: {
      invoke: {
        id: "sendLimitsUpdate",
        src: "sendLimitsUpdate",
        onDone: {
          target: "limitsTokenForm",
          actions: assign({
            settings: (context, event) => event.data.settings,
            tokenInstruction: (context, event) => event.data.token,
          }),
        },
        onError: {
          target: "failure",
        },
      },
    },
    changeLimitsAmountForm: {
      on: {
        CANCEL_CHOICE: "loadingLimitsData",
        SUBMIT_LIMIT: {
          actions: assign({ limit: (context, { limit }) => limit }),
          target: "submittingLimitData",
        },
      },
    },
    changeVerificationMethodForm: {
      on: {
        CANCEL_CHOICE: "loadingLimitsData",
        SUBMIT_VERIFICATION_METHOD: {
          actions: assign({
            verificationMethod: (context, { verificationMethod }) =>
              verificationMethod,
          }),
          target: "submittingLimitData",
        },
      },
    },
    limitsTokenForm: {
      on: {
        CANCEL_CHOICE: "loadingLimitsData",
        SUBMIT_TOKEN: "submittingToken",
        RESET_TOKEN: {
          target: "submittingLimitData",
          actions: assign({ error: (context, event) => false }),
        },
      },
    },
  },
});
```
