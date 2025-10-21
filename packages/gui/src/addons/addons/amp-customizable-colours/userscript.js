// This addon is different from the implementation in SA. This will NOT work on scratch.mit.edu
// because it hooks heavily into AmpMod internals.

import { GUI_CUSTOM, GUI_MAP, GUI_LIGHT, GUI_DARK, ACCENT_GREEN } from "../../../lib/themes";
import { detectTheme } from "../../../lib/themes/themePersistance";

function darkenHex(hex, factor = 0.8) {
  const c = hex.replace("#", "");
  const r = Math.floor(parseInt(c.substring(0, 2), 16) * factor);
  const g = Math.floor(parseInt(c.substring(2, 4), 16) * factor);
  const b = Math.floor(parseInt(c.substring(4, 6), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function isDark(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance < 128;
}

export default async function ({ addon }) {
  const apply = () => {
    const accent = addon.settings.get("accent");
    const workspace = addon.settings.get("workspace");
    const ui = addon.settings.get("ui");
    const sidebar = addon.settings.get("sidebar");

    // Decide base theme
    const baseGUI = isDark(workspace) || isDark(ui) || isDark(sidebar) ? GUI_DARK : GUI_LIGHT;

    // Merge gui colors
    const guiColors = {
      ...baseGUI.guiColors,
      ...ACCENT_GREEN.guiColors,
      "motion-primary": accent,
      "motion-tertiary": darkenHex(accent, 0.7),
      "looks-secondary": accent,
      "looks-secondary-dark": darkenHex(accent, 0.7),
      "looks-transparent": accent + "26",
      "assets-background": sidebar,
      "workspace-background": workspace,
      "ui-primary": ui,
      "ui-secondary": darkenHex(ui, 0.95),
      "ui-tertiary": darkenHex(ui, 0.8),
    };

    const blockColors = {
      ...baseGUI.blockColors,
      checkboxActiveBackground: accent,
      checkboxActiveBorder: darkenHex(accent, 0.7),
    };

    GUI_MAP[GUI_CUSTOM] = {
      guiColors,
      blockColors,
    };

    const newTheme = addon.tab.redux.state.scratchGui.theme.theme.set("gui", GUI_CUSTOM);

    addon.tab.redux.dispatch({
      type: "scratch-gui/theme/SET_THEME",
      theme: newTheme,
    });
  };

  const disable = () => {
    const defaultTheme = detectTheme().gui;

    addon.tab.redux.dispatch({
      type: "scratch-gui/theme/SET_THEME",
      theme: defaultTheme,
    });
  };

  addon.self.addEventListener("disabled", disable);
  addon.self.addEventListener("reenabled", apply);
  addon.settings.addEventListener("change", apply);
  apply();
}
