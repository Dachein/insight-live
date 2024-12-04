const towxml = require('../towxml/index');

class ContentParser {
  static parse(content) {
    if (!content) return '';
    
    // 预处理特殊标记
    content = this.preProcessContent(content);
    
    // 使用 towxml 解析 markdown
    const markdownData = towxml(content, 'markdown', {
      theme: 'dark',
      events: {
        tap: (e) => {
          // 处理链接点击
          if (e.currentTarget.dataset.data && e.currentTarget.dataset.data.attr && e.currentTarget.dataset.data.attr.href) {
            const url = e.currentTarget.dataset.data.attr.href;
            if (url) {
              wx.setClipboardData({
                data: url,
                success: () => {
                  wx.showToast({
                    title: '链接已复制',
                    icon: 'success'
                  });
                }
              });
            }
          }
        }
      }
    });

    return markdownData;
  }

  static preProcessContent(content) {
    // 处理代码块，添加特殊样式
    content = content.replace(/```([\s\S]*?)```/g, (match, p1) => {
      return `<div class="custom-code-block">${p1}</div>`;
    });

    // 处理紫色加粗的内容 {text}
    content = content.replace(/\{([^}]+)\}/g, '<span class="highlight-purple">$1</span>');

    // 处理湖蓝色加粗的内容 [text]
    content = content.replace(/\[([^\]]+)\]/g, '<span class="highlight-blue">$1</span>');

    return content;
  }
}

module.exports = ContentParser; 