import { TokenInstruction } from "api/token";
import { LimitsSettings, VerificationMethod } from "api/limits";
import { Money, MoneyLimitType } from "api/types";

export type ChangeLimitsEvent =
  | { type: "CHOOSE_DAILY_LIMIT" }
  | { type: "CHOOSE_MONTHLY_LIMIT" }
  | { type: "CHOOSE_VERIFICATION_METHOD" }
  | { type: "CANCEL_CHOICE" }
  | { type: "SUBMIT_LIMIT"; limit: Money }
  | {
      type: "SUBMIT_VERIFICATION_METHOD";
      verificationMethod: VerificationMethod;
    }
  | { type: "SUBMIT_TOKEN"; password: string }
  | { type: "RESET_TOKEN" };

export interface ChangeLimitsContext {
  settings?: LimitsSettings;
  tokenInstruction?: TokenInstruction;
  limitType?: MoneyLimitType;
  error: boolean;
}
