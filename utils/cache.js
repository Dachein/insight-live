class Cache {
  static set(key, value, expireHours = 24) {
    try {
      wx.setStorageSync(key, {
        data: value,
        expire: Date.now() + expireHours * 60 * 60 * 1000
      })
    } catch (e) {
      console.error('Cache set error:', e)
    }
  }

  static get(key) {
    try {
      const cache = wx.getStorageSync(key)
      if (!cache) return null
      if (cache.expire < Date.now()) {
        wx.removeStorageSync(key)
        return null
      }
      return cache.data
    } catch (e) {
      console.error('Cache get error:', e)
      return null
    }
  }
}

export default Cache 