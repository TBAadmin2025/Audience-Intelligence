import { diagnosticConfig } from "../client/config";

type ThemeVars = Record<string, string>;

const baseVars = (): ThemeVars => ({
  "--color-primary": diagnosticConfig.brand.primaryColor,
  "--color-accent": diagnosticConfig.brand.accentColor,
  "--color-accent-secondary": diagnosticConfig.brand.accentSecondary,
  "--color-bg": diagnosticConfig.brand.backgroundColor,
  "--color-surface": diagnosticConfig.brand.surfaceColor,
  "--color-text": diagnosticConfig.brand.textPrimary,
  "--color-muted": diagnosticConfig.brand.textMuted,
  "--font-heading": diagnosticConfig.brand.headingFont,
  "--font-body": diagnosticConfig.brand.bodyFont,
});

const vibeExtras: Record<string, ThemeVars> = {
  luxury: {
    "--shadow-glow": "0 0 30px rgba(212, 175, 55, 0.15)",
    "--border-radius": "4px",
    "--heading-style": "italic",
  },
  professional: {
    "--shadow-glow": "0 2px 8px rgba(0, 0, 0, 0.1)",
    "--border-radius": "6px",
    "--heading-style": "normal",
  },
  bold: {
    "--shadow-glow": "0 4px 12px rgba(0, 0, 0, 0.2)",
    "--border-radius": "2px",
    "--heading-style": "normal",
  },
  clean: {
    "--shadow-glow": "none",
    "--border-radius": "8px",
    "--heading-style": "normal",
  },
  warm: {
    "--shadow-glow": "0 2px 12px rgba(139, 90, 43, 0.1)",
    "--border-radius": "8px",
    "--heading-style": "normal",
  },
};

export function getThemeVars(vibe: string): ThemeVars {
  return {
    ...baseVars(),
    ...(vibeExtras[vibe] || vibeExtras.luxury),
  };
}
