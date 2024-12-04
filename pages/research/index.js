import { i18n } from '../../utils/i18n';
import { themeManager } from '../../utils/theme';

Page({
  data: {
    theme: themeManager.getTheme(),
    pageType: 'research'
  },

  onLoad() {
    this.setData({
      t: i18n.t.bind(i18n)
    });
  },

  onShow() {
    this.setData({
      theme: themeManager.getTheme(),
      t: i18n.t.bind(i18n)
    });
  }
}); 