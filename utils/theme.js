class ThemeManager {
  constructor() {
    const savedTheme = wx.getStorageSync('theme');
    this.theme = savedTheme || 'dark';
    if (!savedTheme) {
      wx.setStorageSync('theme', 'dark');
    }
    this.updateTabBar();
  }

  setTheme(theme) {
    this.theme = theme;
    wx.setStorageSync('theme', theme);
    
    // 更新TabBar样式
    this.updateTabBar();
    
    // 更新所有页面的主题
    this.updateAllPages(theme);
  }

  getTheme() {
    return this.theme;
  }

  updateTabBar() {
    if (this.theme === 'dark') {
      wx.setTabBarStyle({
        backgroundColor: '#1C1C1E',
        borderStyle: 'black',
        color: '#8E8E93',
        selectedColor: '#38BDF8'
      });
    } else {
      wx.setTabBarStyle({
        backgroundColor: '#FFFFFF',
        borderStyle: 'white',
        color: '#8E8E93',
        selectedColor: '#38BDF8'
      });
    }
  }

  updateAllPages(theme) {
    const pages = getCurrentPages();
    pages.forEach(page => {
      if (page && page.setData) {
        page.setData({ theme });
      }
    });
  }
}

export const themeManager = new ThemeManager(); 