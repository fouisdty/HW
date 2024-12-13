Page({
  data: {
    username: '',
    password: ''
  },

  login() {
    const { username, password } = this.data;
    
    if (!username || !password) {
      wx.showToast({
        title: '请输入账号和密码',
        icon: 'none'
      });
      return;
    }

    // 验证账号是否为 'a'
    if (username !== 'a') {
      wx.showToast({
        title: '账号错误',
        icon: 'error'
      });
      return;
    }

    // 验证密码是否为 '123456'
    if (password !== '123456') {
      wx.showToast({
        title: '密码错误',
        icon: 'error'
      });
      return;
    }

    wx.showLoading({
      title: '登录中'
    });

    setTimeout(() => {
      wx.hideLoading();
      wx.showToast({
        title: '登录成功',
        icon: 'success',
        duration: 1000,
        success: () => {
          setTimeout(() => {
            wx.reLaunch({
              url: '/pages/index/index'
            });
          }, 1000);
        }
      });
    }, 1000);
  }
}); 