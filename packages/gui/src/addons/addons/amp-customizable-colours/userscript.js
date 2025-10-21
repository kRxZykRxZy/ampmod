// This addon is different from the implementation in SA. This will NOT work on scratch.mit.edu
// because it hooks heavily into AmpMod internals.

import { GUI_CUSTOM, GUI_MAP, GUI_AMP_LIGHT, GUI_LIGHT, GUI_DARK, ACCENT_GREEN } from "../../../lib/themes";
import { detectTheme } from "../../../lib/themes/themePersistance";

function darkenHex(hex, factor = 0.8) {
  const c = hex.replace("#", "");
  const r = Math.floor(parseInt(c.substring(0, 2), 16) * factor);
  const g = Math.floor(parseInt(c.substring(2, 4), 16) * factor);
  const b = Math.floor(parseInt(c.substring(4, 6), 16) * factor);
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function getLuminance(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function decideBaseTheme(accent, workspace, ui, menubar) {
  const uiLum = getLuminance(ui);
  const accentLum = getLuminance(accent);
  const workspaceLum = getLuminance(workspace);
  const menubarLum = getLuminance(menubar);

  // Dark check: if any main color is quite dark, use dark theme
  if (uiLum < 80 || accentLum < 80 || workspaceLum < 80) return "dark";

  // Menu bar special rule
  if (menubarLum > 230) return "light"; // very bright = light theme
  return "light-classic"; // otherwise, light-classic
}

export default async function ({ addon }) {
  const apply = () => {
    const accent = addon.settings.get("accent");
    const workspace = addon.settings.get("workspace");
    const ui = addon.settings.get("ui");
    const menubar = addon.settings.get("menubar");
    let baseOption = addon.settings.get("base");

    if (baseOption === "auto" || !baseOption) {
      baseOption = decideBaseTheme(accent, workspace, ui, menubar);
    }

    // Pick base GUI
    let baseGUI;
    switch (baseOption) {
      case "dark":
        baseGUI = GUI_MAP[GUI_DARK];
        break;
      case "light-classic":
        baseGUI = GUI_MAP[GUI_LIGHT];
        break;
      case "light":
      default:
        baseGUI = GUI_MAP[GUI_AMP_LIGHT];
        break;
    }

    // Merge gui colors
    const guiColors = {
      ...baseGUI.guiColors,
      ...ACCENT_GREEN.guiColors,
      "motion-primary": accent,
      "motion-tertiary": darkenHex(accent, 0.7),
      "looks-secondary": accent,
      "looks-secondary-dark": darkenHex(accent, 0.7),
      "looks-transparent": accent + "26",
      "ui-primary": ui,
      "ui-secondary": darkenHex(ui, 0.96),
      "ui-tertiary": darkenHex(ui, 0.87),
      "menu-bar-background": menubar,
    };

    const blockColors = {
      ...baseGUI.blockColors,
      workspace: workspace,
      checkboxActiveBackground: accent,
      checkboxActiveBorder: darkenHex(accent, 0.7),
    };

    GUI_MAP[GUI_CUSTOM] = { guiColors, blockColors };

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
