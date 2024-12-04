import { i18n } from '../../utils/i18n';
import { themeManager } from '../../utils/theme';

Page({
  data: {
    theme: themeManager.getTheme(),
    pageType: 'ask'
  },

  onLoad() {
    this.setData({
      t: i18n.t.bind(i18n)
    });
  },

  onShow() {
    // 检查主题是否变化
    const currentTheme = themeManager.getTheme();
    if (this.data.theme !== currentTheme) {
      this.setData({
        theme: currentTheme
      });
    }
  }
}); 