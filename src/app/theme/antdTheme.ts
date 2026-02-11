import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    colorPrimary: '#242EDB',
    colorError: '#ff3b30',

    fontFamily:
      '"Open Sans", system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif',

    borderRadius: 12,
  },

  components: {
    Button: {
      controlHeight: 44,
      controlHeightLG: 54,
      controlHeightSM: 36,

      paddingInline: 20,
      paddingInlineLG: 16,
      paddingInlineSM: 14,

      fontSize: 14,
      fontSizeLG: 18,
      fontSizeSM: 13,

      borderRadius: 12,
    },
    Input: { borderRadius: 12 },
    Table: { borderRadius: 16 },
    Modal: { borderRadius: 16 },
  },
};
