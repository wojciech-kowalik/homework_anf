import React from "react";

import {
  ChangeLimitsAmountFormView,
  ChangeLimitsListingView,
  ChangeLimitsVerificationMethodFormView,
  ChangeLimitsTokenView,
} from "ui/change-limits/views";

import { Loader } from "ui/atoms";
import { useMachine } from "@xstate/react";
import { ChangeLimitsMachine } from "./machine/ChangeLimitMachine";

interface ChangeLimitsProcessProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export const ChangeLimitsProcess: React.FC<ChangeLimitsProcessProps> = (
  props
) => {
  const { onSuccess, onCancel } = props;

  const [state, send] = useMachine(ChangeLimitsMachine, {
    actions: {
      onSuccess: (context, event) => {
        onSuccess();
      },
      onCancel: (context, event) => {
        onCancel();
      },
    },
  });

  switch (state.value) {
    case "loadingLimitsData":
    case "submittingLimitData":
    case "submittingToken":
      return <Loader />;
    case "showLimits":
      return (
        <ChangeLimitsListingView
          settings={state.context.settings!}
          onChangeDailyLimit={() => send("CHOOSE_DAILY_LIMIT")}
          onChangeMonthlyLimit={() => send("CHOOSE_MONTHLY_LIMIT")}
          onChangeVerificationMethod={() => send("CHOOSE_VERIFICATION_METHOD")}
        />
      );
    case "changeLimitsAmountForm":
      return (
        <ChangeLimitsAmountFormView
          settings={state.context.settings!}
          limitType={state.context.limitType!}
          onApply={(limit) => send("SUBMIT_LIMIT", { limit })}
          onCancel={() => send("CANCEL_CHOICE")}
        />
      );
    case "changeVerificationMethodForm":
      return (
        <ChangeLimitsVerificationMethodFormView
          settings={state.context.settings!}
          onApply={(verificationMethod) =>
            send("SUBMIT_VERIFICATION_METHOD", { verificationMethod })
          }
          onCancel={() => send("CANCEL_CHOICE")}
        />
      );
    case "limitsTokenForm":
      return (
        <ChangeLimitsTokenView
          settings={state.context.settings!}
          instruction={state.context.tokenInstruction?.instruction!}
          onSubmit={(password) => send("SUBMIT_TOKEN", { password })}
          onReset={() => send("RESET_TOKEN")}
          onCancel={() => send("CANCEL_CHOICE")}
          error={state.context.error}
        />
      );
  }

  return null;
};
