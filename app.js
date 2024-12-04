import { themeManager } from './utils/theme';
import { i18n } from './utils/i18n';

App({
  onLaunch() {
    // 初始化主题和语言
    const theme = wx.getStorageSync('theme') || 'dark';
    const language = wx.getStorageSync('language') || 'en';

    // 强制设置默认值
    themeManager.setTheme(theme);
    i18n.setLocale(language);

    // 更新全局UI
    this.updateTabBarLabels();
  },

  onShow() {
    // 每次显示时检查并更新
    this.updateTabBarLabels();
  },

  globalData: {
    themeManager,
    i18n
  },

  updateTabBarLabels() {
    const t = this.globalData.i18n.t.bind(this.globalData.i18n);
    const labels = [
      { index: 0, key: 'tabLive' },
      { index: 1, key: 'tabResearch' },
      { index: 2, key: 'tabAsk' },
      { index: 3, key: 'tabMy' }
    ];

    labels.forEach(({ index, key }) => {
      wx.setTabBarItem({
        index,
        text: t(key)
      });
    });
  }
}); 