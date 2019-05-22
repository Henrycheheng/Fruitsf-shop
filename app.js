//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var that = this

    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        that.globalData.code = res.code
        // that.setData({
        //   code: res.code
        // })
        wx.request({
          url: 'https://xfshop.mynatapp.cc' + '/login/',
          data: {
            code: res.code,
          },
          success: function (res) {
            console.log(res, 'resres')
            if (res.statusCode === 200) {
              console.log(res.data.sessionId)
              wx.setStorageSync('sessionkey', res.data.sessionId)
              if (that.employIdCallback) {
                that.employIdCallback(res.data.sessionId)
              }
            } else {

            }
          }
        })
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.switchTab({
            url: '/pages/index/index'
          })
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res, '666666666666')
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else{
          wx.reLaunch({
            url: '/pages/authorize/authorize'
          })
        }
      }
    })
  },
  globalData: {
    sessionkey: '',
    code: '',
    userInfo: null,
    baseUrl: 'https://xfshop.mynatapp.cc',
    cartNum: '',
    addressId:'',
    finalamount: null
  }
})