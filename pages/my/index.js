import { i18n } from '../../utils/i18n';
import { themeManager } from '../../utils/theme';

Page({
  data: {
    theme: 'dark',
    isDarkMode: true,
    currentLanguage: i18n.getLocale(),
    currentLanguageName: '',
    userInfo: {
      name: 'Guest User'
    }
  },

  onLoad() {
    this.updateLanguageDisplay();
  },

  onShow() {
    this.updateLanguageDisplay();
  },

  updateLanguageDisplay() {
    const currentLocale = i18n.getLocale();
    const languageMap = {
      'zh-Hans': 'langZhHans',
      'zh-Hant': 'langZhHant',
      'en': 'langEn',
      'ar': 'langAr'
    };
    
    this.setData({
      theme: themeManager.getTheme(),
      t: i18n.t.bind(i18n),
      currentLanguage: currentLocale,
      currentLanguageName: i18n.t(languageMap[currentLocale])
    });
  },

  handleNewPost() {
    wx.showToast({
      title: this.data.t('comingSoon'),
      icon: 'none'
    });
  },

  handleThemeChange(e) {
    const isDark = e.detail.value;
    const theme = isDark ? 'dark' : 'light';
    themeManager.setTheme(theme);
    this.setData({
      theme,
      isDarkMode: isDark
    });
  },

  showLanguageSelector() {
    const languageOptions = [
      { key: 'langZhHans', locale: 'zh-Hans' },
      { key: 'langZhHant', locale: 'zh-Hant' },
      { key: 'langEn', locale: 'en' },
      { key: 'langAr', locale: 'ar' }
    ];

    const languages = languageOptions.map(option => ({
      name: i18n.t(option.key),
      locale: option.locale
    }));

    wx.showActionSheet({
      itemList: languages.map(lang => lang.name),
      success: (res) => {
        const selectedLocale = languages[res.tapIndex].locale;
        i18n.setLocale(selectedLocale);
        
        // 更新全局语言
        const app = getApp();
        app.updateTabBarLabels();
        
        // 更新当前页面显示
        this.updateLanguageDisplay();
      }
    });
  }
}); 