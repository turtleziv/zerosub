import { describe, expect, it } from "vitest";
import { preferences } from "../shared/preferences";
import { AUTOMATIC_ROWS, COMPOSER_ROWS, DEFAULT_ACCOUNT_ROWS, SWITCH_ROWS } from "./preference-rows";

describe("preference switches shared by the Accounts screen and the preferences page", () => {
  it("groups the default-account switches together", () => {
    expect(DEFAULT_ACCOUNT_ROWS).toEqual(["moveAgentsOnDefaultChange", "balanceNewAgents"]);
  });

  // Banked resets and forking only act once automatic switching has run out of accounts.
  it("keeps every out-of-room switch under automatic switching", () => {
    expect(AUTOMATIC_ROWS).toEqual(["autoSwitch", "autoContinue", "autoRedeem", "forkOtherProvider"]);
    expect(COMPOSER_ROWS).toEqual(["showComposerPill"]);
  });

  it("lists every on/off preference exactly once", () => {
    const listed = [...DEFAULT_ACCOUNT_ROWS, ...AUTOMATIC_ROWS, ...COMPOSER_ROWS].sort();
    const defaults = preferences.schema.parse({}) as Record<string, unknown>;
    const switches = Object.keys(defaults).filter((key) => typeof defaults[key] === "boolean").sort();
    expect(listed).toEqual(switches);
    expect(Object.keys(SWITCH_ROWS).sort()).toEqual(switches);
  });

  it("marks the switches that only work while automatic switching is on", () => {
    const needing = Object.entries(SWITCH_ROWS)
      .filter(([, row]) => row.needsAutoSwitch)
      .map(([key]) => key)
      .sort();
    expect(needing).toEqual(["autoContinue", "autoRedeem", "forkOtherProvider"]);
  });

  it("keeps the wording where on means the action happens", () => {
    expect(SWITCH_ROWS.moveAgentsOnDefaultChange.label).toBe("Move open agents when the default changes");
    for (const row of Object.values(SWITCH_ROWS)) {
      expect(row.label.trim()).not.toBe("");
      expect(row.hint.trim()).not.toBe("");
    }
  });
});
