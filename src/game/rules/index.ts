import { createAccountRules } from "./createAccountRules";
import { recoverAccountRules } from "./recoverAccountRules";

export const allRules = [...createAccountRules, ...recoverAccountRules];
