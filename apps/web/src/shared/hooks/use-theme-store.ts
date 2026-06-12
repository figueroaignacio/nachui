// Theme color is fixed to zinc — no switching needed.
// Kept as a stub so existing imports don't break during migration.
export type ThemeColor = 'zinc';

interface ThemeState {
  color: ThemeColor;
  setColor: (color: ThemeColor) => void;
}

export const useThemeStore = (): ThemeState => ({
  color: 'zinc',
  setColor: () => {},
});
