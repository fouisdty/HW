Page({
  data: {
    inputValue: '',
    messages: [],
    scrollToView: '',
  },

  onLoad() {
    this.apiKey = 'sk-f2a7382aae2f4f5d97e7a66759eead76';
  },

  onInput(e) {
    this.setData({
      inputValue: e.detail.value
    });
  },

  async sendMessage() {
    const { inputValue, messages } = this.data;
    if (!inputValue.trim()) {
      wx.showToast({
        title: '请输入内容',
        icon: 'none'
      });
      return;
    }
    
    const currentTime = this.formatTime(new Date());
    
    // 添加用户消息
    const userMessage = {
      type: 'user',
      content: inputValue,
      time: currentTime
    };
    
    this.setData({
      messages: [...messages, userMessage],
      inputValue: ''
    });

    // 显示加载状态
    wx.showLoading({
      title: '思考中...'
    });

    try {
      // 调用通义千问 API
      const response = await wx.request({
        url: 'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
        method: 'POST',
        header: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        data: {
          model: 'qwen-plus',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant.'
            },
            {
              role: 'user',
              content: inputValue
            }
          ]
        }
      });

      // 添加 AI 回复
      if (response.data.choices && response.data.choices[0]) {
        const aiMessage = {
          type: 'ai',
          content: response.data.choices[0].message.content,
          time: this.formatTime(new Date())
        };

        this.setData({
          messages: [...this.data.messages, aiMessage],
          scrollToView: `msg-${this.data.messages.length}`
        });
      }
    } catch (error) {
      console.error('API调用失败:', error);
      wx.showToast({
        title: '回复失败，请重试',
        icon: 'none'
      });
    } finally {
      wx.hideLoading();
    }
  },

  formatTime(date) {
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  },

  handleBack() {
    wx.navigateBack({
      delta: 1
    });
  }
}); 