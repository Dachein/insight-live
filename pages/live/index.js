import { supabaseService } from '../../utils/supabase'
import Cache from '../../utils/cache'
import ContentParser from '../../utils/contentParser'
import TimeHelper from '../../utils/timeHelper'
import { themeManager } from '../../utils/theme'

Page({
  data: {
    posts: [],
    loading: false,
    refreshing: false,
    currentType: '',     // 当前选中的类型
    selectedTags: [],    // 选中的标签数组
    allPosts: [],         // 存储所有帖子
    lastTapTime: 0,
    touchStartTime: 0,
    theme: themeManager.getTheme()
  },

  onLoad: function () {
    this.loadPosts()
    this.timeUpdateTimer = setInterval(() => {
      this.updateRelativeTimes()
    }, 60000)
  },

  onUnload: function () {
    // 清除定时器
    if (this.timeUpdateTimer) {
      clearInterval(this.timeUpdateTimer)
    }
  },

  // 下拉刷新
  async onPullDownRefresh() {
    try {
      this.setData({ refreshing: true })
      await this.loadPosts(true) // true 表示强制刷新
    } finally {
      this.setData({ refreshing: false })
      wx.stopPullDownRefresh()
    }
  },

  // 清除所有筛选条件
  clearAllFilters() {
    this.setData({
      currentType: '',
      selectedTags: []
    })
    this.filterPosts()
  },

  // 切换类型
  switchType(e) {
    const type = e.currentTarget.dataset.type
    // 如果点击当前选中的类型，则取消选择
    const newType = this.data.currentType === type ? '' : type
    this.setData({ currentType: newType })
    this.filterPosts()
  },

  // 切换标签选择
  toggleTag(e) {
    // 阻止事件冒泡
    e.stopPropagation()
    
    const tag = e.currentTarget.dataset.tag
    const { selectedTags } = this.data
    let newSelectedTags

    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter(t => t !== tag)
    } else {
      newSelectedTags = [...selectedTags, tag]
    }

    this.setData({ selectedTags: newSelectedTags })
    this.filterPosts()
  },

  // 更新过滤逻辑
  filterPosts() {
    const { currentType, selectedTags, allPosts } = this.data
    let filteredPosts = allPosts

    // 按类型筛选
    if (currentType) {
      filteredPosts = filteredPosts.filter(post => post.type_text === currentType)
    }

    // 按标签筛选
    if (selectedTags.length > 0) {
      filteredPosts = filteredPosts.filter(post => 
        post.tags.some(tag => selectedTags.includes(tag))
      )
    }

    this.setData({ posts: filteredPosts })
  },

  async loadPosts(forceRefresh = false) {
    try {
      this.setData({ loading: true })
      
      if (!forceRefresh) {
        const cachedPosts = Cache.get('posts')
        if (cachedPosts) {
          const processedPosts = this.processPostsData(cachedPosts)
          this.setData({ 
            allPosts: processedPosts,
            posts: processedPosts
          })
          return
        }
      }

      const posts = await supabaseService.getPosts()
      const processedPosts = this.processPostsData(posts)
      this.setData({ 
        allPosts: processedPosts,
        posts: processedPosts
      })
      
      Cache.set('posts', posts, 1)

      if (forceRefresh) {
        wx.showToast({
          title: '刷新成功',
          icon: 'success',
          duration: 1500
        })
      }
    } catch (error) {
      wx.showToast({
        title: '加载失败',
        icon: 'none'
      })
    } finally {
      this.setData({ loading: false })
    }
  },

  updateRelativeTimes() {
    const { posts } = this.data
    const updatedPosts = posts.map(post => ({
      ...post,
      relative_time: TimeHelper.getRelativeTime(post.create_time)
    }))
    this.setData({ posts: updatedPosts })
  },

  processPostsData(posts) {
    return posts.map(post => ({
      ...post,
      parsedContent: ContentParser.parse(post.content),
      relative_time: TimeHelper.getRelativeTime(post.create_time),
      currentImageIndex: 0
    }))
  },

  // 处理触摸开始
  handleTouchStart(e) {
    // 检查是否点击在图片区域或标签区域
    if (e.target.dataset.current || e.target.dataset.tag) {
      return;
    }
    this.setData({ touchStartTime: Date.now() });
  },

  // 处理触摸结束
  handleTouchEnd(e) {
    // 检查是否点击在图片区域或标签区域
    if (e.target.dataset.current || e.target.dataset.tag) {
      return;
    }
    
    const touchEndTime = Date.now();
    const touchDuration = touchEndTime - this.data.touchStartTime;

    if (touchDuration < 200) {
      this.handlePotentialDoubleTap(e);
    }
  },

  // 处理可能的双击
  handlePotentialDoubleTap(e) {
    const currentTime = Date.now()
    const lastTapTime = this.data.lastTapTime
    const postId = e.currentTarget.dataset.id

    // 如果两次点击间隔小于 300ms，认为是双击
    if (currentTime - lastTapTime < 300) {
      this.handleDoubleTap(postId)
    }

    this.setData({ lastTapTime: currentTime })
  },

  // 处理双击点赞
  async handleDoubleTap(postId) {
    // 显示点赞动画
    const { posts, allPosts } = this.data
    const postIndex = posts.findIndex(p => p.id === postId)
    if (postIndex === -1) return

    // 更新动画状态
    const post = posts[postIndex]
    post.showLikeAnimation = true
    this.setData({ posts })

    try {
      // 更新数据库并获取更新后的帖子数据
      const updatedPost = await supabaseService.incrementLikes(postId)
      
      // 处理返回的数据
      const processedPost = {
        ...updatedPost,
        parsedContent: ContentParser.parse(updatedPost.content),
        relative_time: TimeHelper.getRelativeTime(updatedPost.create_time)
      }

      // 更新本地数据
      posts[postIndex] = processedPost
      const allPostIndex = allPosts.findIndex(p => p.id === postId)
      if (allPostIndex !== -1) {
        allPosts[allPostIndex] = processedPost
      }

      this.setData({ 
        posts: [...posts],  // 使用新数组触发更新
        allPosts: [...allPosts]
      })

      // 更新缓存
      Cache.set('posts', allPosts, 1)

      // 添加触感反馈
      wx.vibrateShort({
        type: 'light'
      })

    } catch (error) {
      console.error('Like error:', error)
      wx.showToast({
        title: '点赞失败',
        icon: 'none'
      })
    } finally {
      // 800ms 后隐藏动画
      setTimeout(() => {
        const currentPosts = this.data.posts
        const currentPost = currentPosts[postIndex]
        if (currentPost) {
          currentPost.showLikeAnimation = false
          this.setData({ posts: currentPosts })
        }
      }, 800)
    }
  },

  // 处理标签点击
  handleTagClick(e) {
    e.stopPropagation();
    const tag = e.currentTarget.dataset.tag;
    const { selectedTags } = this.data;
    let newSelectedTags;

    if (selectedTags.includes(tag)) {
      newSelectedTags = selectedTags.filter(t => t !== tag);
    } else {
      newSelectedTags = [...selectedTags, tag];
    }

    this.setData({ 
      selectedTags: newSelectedTags,
      currentType: ''  // 清除类型筛选
    });
    this.filterPosts();

    // 添加触感反馈
    wx.vibrateShort({ type: 'light' });
  },

  // 处理轮播图变化
  handleSwiperChange(e) {
    const { current } = e.detail;
    const postId = e.currentTarget.dataset.postId;
    const { posts } = this.data;
    
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex !== -1) {
      posts[postIndex].currentImageIndex = current;
      this.setData({ posts });
    }
  },

  // 处理图片预览
  handleImagePreview(e) {
    const { url } = e.currentTarget.dataset;
    
    console.log('Preview image:', url); // 调试日志
    
    wx.previewImage({
      urls: [url],  // 只传入当前图片
      current: url,
      success: () => {
        console.log('Preview success');
      },
      fail: (err) => {
        console.error('Preview failed:', err);
        wx.showToast({
          title: '预览失败',
          icon: 'none'
        });
      }
    });
  },

  // 阻止事件冒泡
  preventBubble() {
    // 空函数，仅用于阻止事件冒泡
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
}) 