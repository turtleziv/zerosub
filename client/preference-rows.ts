import type { Preferences } from "../shared/preferences";

export type SwitchKey = {
  [K in keyof Preferences]: Preferences[K] extends boolean ? K : never;
}[keyof Preferences];

export type SwitchRow = {
  label: string;
  hint: string;
  /** Greyed out while "Switch accounts when one hits its limit" is off. */
  needsAutoSwitch: boolean;
};

/** One wording per switch, so the Accounts screen and the preferences page never drift apart. */
export const SWITCH_ROWS: Record<SwitchKey, SwitchRow> = {
  moveAgentsOnDefaultChange: {
    label: "Move open agents when the default changes",
    hint: "Off: open agents stay on the account they're using, even after they reopen. New agents, and agents that aren't open at the time, use the new default.",
    needsAutoSwitch: false,
  },
  balanceNewAgents: {
    label: "Spread new agents across accounts",
    hint: "New agents start on the account with the most room instead of the default.",
    needsAutoSwitch: false,
  },
  autoSwitch: {
    label: "Switch accounts when one hits its limit",
    hint: "Agents move to the account with the most room left.",
    needsAutoSwitch: false,
  },
  autoContinue: {
    label: "Keep going after a switch",
    hint: "Sends a short follow-up so the interrupted task continues.",
    needsAutoSwitch: true,
  },
  autoRedeem: {
    label: "Use banked resets when every account is out",
    hint: "Spends one of the account's banked resets instead of stopping. Resets are scarce, so this is off unless you turn it on.",
    needsAutoSwitch: true,
  },
  forkOtherProvider: {
    label: "When every account is out, fork the chat to the other provider",
    hint: "A stopped Claude chat carries on in a new ChatGPT agent, or the other way round, with the conversation so far. The new agent gets no more permissions than the original; the original stays as it was.",
    needsAutoSwitch: true,
  },
  showComposerPill: {
    label: "Show the account pill in the composer",
    hint: "Appears on Claude and Codex agents once a provider has two or more accounts.",
    needsAutoSwitch: false,
  },
};

/** What happens around the default account: agents already open, and agents about to start. */
export const DEFAULT_ACCOUNT_ROWS: SwitchKey[] = ["moveAgentsOnDefaultChange", "balanceNewAgents"];
/** Everything that acts when an account runs out; all but the first need it on. */
export const AUTOMATIC_ROWS: SwitchKey[] = ["autoSwitch", "autoContinue", "autoRedeem", "forkOtherProvider"];
/** Only on the preferences page. */
export const COMPOSER_ROWS: SwitchKey[] = ["showComposerPill"];
