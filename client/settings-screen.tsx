import { useHosts, useSettings, type PluginSurfaceProps } from "@getpaseo/plugin/client";
import {
  SettingsAction,
  SettingsCard,
  SettingsInput,
  SettingsSection,
  SettingsSwitch,
} from "@getpaseo/plugin/client/ui";
import { Fragment, useState } from "react";
import { Text } from "react-native";
import { DEFAULT_CONTINUE_PROMPT, preferences, type Preferences } from "../shared/preferences";
import { AUTOMATIC_ROWS, COMPOSER_ROWS, DEFAULT_ACCOUNT_ROWS, SWITCH_ROWS, type SwitchKey } from "./preference-rows";

/** Settings → Plugins → zerosub. Accounts themselves live in the sidebar surface. */
export function PreferencesScreen({ theme, host, onOpenAccounts }: PluginSurfaceProps & { onOpenAccounts(): void }) {
  const settings = useSettings(preferences);
  const multiHost = useHosts().length > 1;
  const [prompt, setPrompt] = useState<string | null>(null);
  const muted = { color: theme.colors.foregroundMuted };
  if (settings.status === "loading") return <Text style={muted}>Loading…</Text>;
  if (settings.status !== "ready") {
    return (
      <SettingsSection title="Preferences">
        <Text style={{ color: theme.colors.statusDanger }}>{settings.error}</Text>
        <SettingsAction label="Try again" actionLabel="Reload" onPress={() => void settings.reload()} />
        {settings.status === "invalid" ? (
          <SettingsAction label="Restore defaults" actionLabel="Reset" onPress={() => void settings.reset()} />
        ) : null}
      </SettingsSection>
    );
  }
  const save = (patch: Partial<Preferences>) =>
    void settings.save({ ...settings.values, ...patch }, settings.revision);
  const toggle = (key: SwitchKey) => {
    const row = SWITCH_ROWS[key];
    return (
      <SettingsSwitch
        key={key}
        label={row.label}
        hint={row.hint}
        value={settings.values[key]}
        disabled={settings.saving || (row.needsAutoSwitch && !settings.values.autoSwitch)}
        onValueChange={(value) => save({ [key]: value })}
      />
    );
  };
  return (
    <>
      {multiHost ? (
        <Text style={muted}>These apply to agents on {host.label}. Each host keeps its own accounts and preferences.</Text>
      ) : null}
      <SettingsSection title="Accounts">
        <SettingsCard>
          <SettingsAction
            label="Add, remove, and choose default accounts"
            actionLabel="Open accounts"
            onPress={onOpenAccounts}
          />
          {DEFAULT_ACCOUNT_ROWS.map(toggle)}
        </SettingsCard>
      </SettingsSection>
      <SettingsSection title="Automatic switching">
        <SettingsCard>
          {AUTOMATIC_ROWS.map((key) => (
            <Fragment key={key}>
              {toggle(key)}
              {key === "autoContinue" ? (
                <>
                  <SettingsInput
                    label="Follow-up message"
                    initialValue={settings.values.continuePrompt}
                    onChangeText={setPrompt}
                    disabled={settings.saving || !settings.values.autoContinue}
                    error={settings.saveError}
                  />
                  <SettingsAction
                    label="Save the follow-up message"
                    actionLabel="Save"
                    disabled={settings.saving || prompt === null || !prompt.trim()}
                    onPress={() => {
                      if (prompt?.trim()) save({ continuePrompt: prompt.trim() });
                    }}
                  />
                  <SettingsAction
                    label="Restore the default follow-up"
                    actionLabel="Restore"
                    disabled={settings.saving || settings.values.continuePrompt === DEFAULT_CONTINUE_PROMPT}
                    onPress={() => save({ continuePrompt: DEFAULT_CONTINUE_PROMPT })}
                  />
                </>
              ) : null}
            </Fragment>
          ))}
        </SettingsCard>
      </SettingsSection>
      <SettingsSection title="Composer">
        <SettingsCard>{COMPOSER_ROWS.map(toggle)}</SettingsCard>
      </SettingsSection>
    </>
  );
}
