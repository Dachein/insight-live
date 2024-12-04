Page({
  data: {
    images: [],
    currentIndex: 0,
    scale: 1,
    navBarVisible: true,
    touchStartTime: 0
  },

  onLoad(options) {
    try {
      const { images, current } = options;
      const decodedImages = JSON.parse(decodeURIComponent(images));
      
      this.setData({
        images: decodedImages,
        currentIndex: parseInt(current) || 0
      });
    } catch (error) {
      console.error('Failed to parse images:', error);
      wx.showToast({
        title: '加载图片失败',
        icon: 'none'
      });
      setTimeout(() => {
        wx.navigateBack();
      }, 1500);
    }
  },

  handleSwiperChange(e) {
    const { current } = e.detail;
    this.setData({
      currentIndex: current,
      scale: 1  // 重置缩放
    });
  },

  handleScale(e) {
    this.setData({
      scale: e.detail.scale
    });
  },

  handleImageTap(e) {
    // 单击切换导航栏显示状态
    const now = Date.now();
    if (now - this.data.touchStartTime < 300) {
      return;  // 防止双击事件冲突
    }
    this.setData({
      navBarVisible: !this.data.navBarVisible
    });
  },

  handleBack() {
    wx.navigateBack();
  },

  handleImageLoad(e) {
    // 图片加载完成后的处理
    const { index } = e.currentTarget.dataset;
    // 可以在这里处理图片加载状态
  }
}); 