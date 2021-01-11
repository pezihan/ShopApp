// 同时发送异步代码的次数
let ajaxTimes = 0;

export const request = (params) => {
    // 判断url是否带有字符串 /my/ 请求私有的路径  带上header token
    let header = {...params.header};
    if(params.url.includes("/my/")){
        // 拼接header 带上token
        header["Authorization"] = wx.getStorageSync("token");
    }

    ajaxTimes++;
    // 显示加载中效果
    wx.showLoading({
        title: '加载中',
        // mask表示需不需要显示一层蒙版，让获取数据的时候页面不能操作滚动
        mask: true
      })
    // 定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1"
    return new Promise((resolve,reject) => {
        wx.request({
            ...params,
            header:header,
            url:baseUrl+params.url,
            success:(result) => {
                resolve(result.data.message)
            },
            fail:(err) => {
                reject(err)
            },
            complete:() => {
                ajaxTimes--;
                // 关闭正在等待的图标
                if(ajaxTimes===0){
                    wx.hideLoading()
                }
            }
        });
    })
}