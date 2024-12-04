const translations = {
  'zh-Hans': {
    // Tab 栏
    tabLive: 'Live',
    tabResearch: '研报图书馆',
    tabAsk: 'AI问答',
    tabMy: '我的',
    // My 页面菜单
    menuNewPost: '发布帖子',
    menuAppearance: '外观设置',
    menuLanguage: '语言设置',
    // My 页面菜单标题
    menuNewPostTitle: '发布帖子',
    menuAppearanceTitle: '外观设置',
    menuLanguageTitle: '语言设置',
    // My 页面菜单描述
    menuNewPostDesc: '创建新的内容',
    menuAppearanceDesc: '深色/浅色主题',
    menuLanguageDesc: '选择显示语言',
    // 语言名称
    langZhHans: '简体中文',
    langZhHant: '繁體中文',
    langEn: 'English',
    langAr: 'العربية',
    // 其他
    comingSoon: '即将推出',
    building: '功能建设中...',
    // Research 和 Ask 页面
    researchTitle: '研报图书馆',
    askTitle: 'AI问答'
  },
  'zh-Hant': {
    // Tab 栏
    tabLive: 'Live',
    tabResearch: '研報圖書館',
    tabAsk: 'AI問答',
    tabMy: '我的',
    // My 页面菜单
    menuNewPost: '發佈帖子',
    menuAppearance: '外觀設置',
    menuLanguage: '語言設置',
    // My 页面菜单标题
    menuNewPostTitle: '發佈帖子',
    menuAppearanceTitle: '外觀設置',
    menuLanguageTitle: '語言設置',
    // My 页面菜单描述
    menuNewPostDesc: '創建新的內容',
    menuAppearanceDesc: '深色/淺色主題',
    menuLanguageDesc: '選擇顯示語言',
    // 语言名称
    langZhHans: '简体中文',
    langZhHant: '繁體中文',
    langEn: 'English',
    langAr: 'العربية',
    // 其他
    comingSoon: '即將推出',
    building: '功能建設中...',
    // Research 和 Ask 页面
    researchTitle: '研報圖書館',
    askTitle: 'AI問答'
  },
  'en': {
    // Tab 栏
    tabLive: 'Live',
    tabResearch: 'Research Library',
    tabAsk: 'AI Ask',
    tabMy: 'My',
    // My 页面菜单
    menuNewPost: 'New Post',
    menuAppearance: 'Appearance',
    menuLanguage: 'Language',
    // My 页面菜单标题
    menuNewPostTitle: 'New Post',
    menuAppearanceTitle: 'Appearance',
    menuLanguageTitle: 'Language',
    // My 页面菜单描述
    menuNewPostDesc: 'Create new content',
    menuAppearanceDesc: 'Dark/Light theme',
    menuLanguageDesc: 'Select the language to display',
    // 语言名称
    langZhHans: '简体中文',
    langZhHant: '繁體中文',
    langEn: 'English',
    langAr: 'العربية',
    // 其他
    comingSoon: 'Coming Soon',
    building: 'Under Construction...',
    // Research 和 Ask 页面
    researchTitle: 'Research Library',
    askTitle: 'AI Ask'
  },
  'ar': {
    // Tab 栏
    tabLive: 'مباشر',
    tabResearch: 'مكتبة البحوث',
    tabAsk: 'الذكاء الاصطناعي',
    tabMy: 'ملفي',
    // My 页面菜单
    menuNewPost: 'منشور جديد',
    menuAppearance: 'المظهر',
    menuLanguage: 'اللغة',
    // My 页面菜单标题
    menuNewPostTitle: 'منشور جديد',
    menuAppearanceTitle: 'المظهر',
    menuLanguageTitle: 'اللغة',
    // My 页面菜单描述
    menuNewPostDesc: 'إنشاء محتوى جديد',
    menuAppearanceDesc: 'اللون الداكن/الفاتح',
    menuLanguageDesc: 'اختر اللغة المعروضة',
    // 语言名称
    langZhHans: '简体中文',
    langZhHant: '繁體中文',
    langEn: 'English',
    langAr: 'العربية',
    // 其他
    comingSoon: 'قريباً',
    building: 'قيد الإنشاء...',
    // Research 和 Ask 页面
    researchTitle: 'مكتبة البحوث',
    askTitle: 'الذكاء الاصطناعي'
  }
};

class I18n {
  constructor() {
    // 修改默认语言为英文
    const savedLocale = wx.getStorageSync('language');
    this.locale = savedLocale || 'en';
    if (!savedLocale) {
      wx.setStorageSync('language', 'en');
    }
  }

  t(key) {
    return translations[this.locale][key] || key;
  }

  setLocale(locale) {
    this.locale = locale;
    wx.setStorageSync('language', locale);
  }

  getLocale() {
    return this.locale;
  }
}

export const i18n = new I18n(); 