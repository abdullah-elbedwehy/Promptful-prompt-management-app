export const Theme = {
  text: {
    primary: '#E4E4E7',    // Light gray for primary text
    secondary: '#A1A1AA',  // Muted gray for secondary text
    tertiary: '#71717A',   // Darker gray for tertiary text
  },
  background: {
    primary: '#18181B',    // Dark background
    secondary: '#27272A',  // Slightly lighter background
    tertiary: '#3F3F46',   // Even lighter background for contrast
  },
  border: {
    primary: '#3F3F46',    // Border color
  },
  primary: '#3B82F6',      // Blue accent color
  error: '#EF4444',        // Red for errors/danger
}

export type ThemeType = typeof Theme; 