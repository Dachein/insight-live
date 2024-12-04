const SUPABASE_URL = 'https://nwzdhunwvojeqzwlavwa.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53emRodW53dm9qZXF6d2xhdndhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzMyMDg4NjQsImV4cCI6MjA0ODc4NDg2NH0.aZ-uR1zpBxagw5kJvD0C8xYa431hEM2dcFy3xJdgcMk'

class SupabaseService {
  constructor() {
    this.baseUrl = SUPABASE_URL
    this.headers = {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
      'Content-Type': 'application/json'
    }
  }

  async getPosts() {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseUrl}/rest/v1/posts?select=*,authors(id,name,avatar),images&order=create_time.desc`,
        method: 'GET',
        header: this.headers,
        success: (res) => {
          if (res.statusCode === 200) {
            resolve(res.data)
          } else {
            reject(new Error('Failed to fetch posts'))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  // 添加新的 post
  async createPost(postData) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseUrl}/rest/v1/posts`,
        method: 'POST',
        header: this.headers,
        data: postData,
        success: (res) => {
          if (res.statusCode === 201) {
            resolve(res.data)
          } else {
            reject(new Error('Failed to create post'))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  // 获取单个 post
  async getPost(id) {
    return new Promise((resolve, reject) => {
      wx.request({
        url: `${this.baseUrl}/rest/v1/posts?id=eq.${id}&select=*,authors(id,name,avatar)`,
        method: 'GET',
        header: this.headers,
        success: (res) => {
          if (res.statusCode === 200 && res.data.length > 0) {
            resolve(res.data[0])
          } else {
            reject(new Error('Post not found'))
          }
        },
        fail: (error) => {
          reject(error)
        }
      })
    })
  }

  // 更新点赞数
  async incrementLikes(postId) {
    return new Promise((resolve, reject) => {
      // 先获取当前数据
      wx.request({
        url: `${this.baseUrl}/rest/v1/posts?id=eq.${postId}&select=*,authors(id,name,avatar)`,
        method: 'GET',
        header: this.headers,
        success: (getRes) => {
          if (getRes.statusCode === 200 && getRes.data.length > 0) {
            const currentPost = getRes.data[0];
            const currentLikes = currentPost.likes_count || 0;

            // 然后更新点赞数
            wx.request({
              url: `${this.baseUrl}/rest/v1/posts?id=eq.${postId}`,
              method: 'PATCH',
              header: {
                ...this.headers,
                'Prefer': 'return=minimal'
              },
              data: {
                likes_count: currentLikes + 1  // 直接使用数值而不是表达式
              },
              success: (updateRes) => {
                if (updateRes.statusCode === 204) {
                  // 返回更新后的完整数据
                  currentPost.likes_count = currentLikes + 1;
                  resolve(currentPost);
                } else {
                  console.error('Update response:', updateRes);
                  reject(new Error('Failed to update likes'));
                }
              },
              fail: (error) => {
                console.error('Update error:', error);
                reject(error);
              }
            });
          } else {
            reject(new Error('Post not found'));
          }
        },
        fail: (error) => {
          console.error('Get error:', error);
          reject(error);
        }
      });
    });
  }
}

export const supabaseService = new SupabaseService() 