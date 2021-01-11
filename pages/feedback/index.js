/*
  1 点击 “+” 触发tap点击事件
    1 调用小程序内置的选择图片的api
    2 获取到图片的路径  数组
    3 把图片路径  存入 到data 的变量中
    4 页面就可以根据  图片数组  进行循环显示   自定义组件
  2 点击  自定义图片  组件
    1 获取被点击的元素的索引
    2 获取  data中的图片数组
    3 根据索引  数组中删除对应的元素
    4 把数组重新设置回data中
  3 点击 “提交”
    1 获取文本域的内容   
      1 data中定义变量 表示 输入框的内容
      2 文本域 绑定 输入事件  事件触发的时候 把输入框的值 存入到变量中
    2 对内容  合法性验证
    3 验证通过 用户选择的图片  上传到专门的图片服务器  返回图片外网的链接
    4 文本域 和 外网图片的路径 一起提交到服务器中   前端的模拟  并不会发送请求到后台
    5 清空当前页面
    6 返回上一页
*/ 
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    // 被选中的图片路径数组
    chooseImgs: [],
    // 文本域的内容
    textVal:""
  },
  // 外网图片的路径数组
  UpLoadImgs: [],
    // 相当于标题的点击事件  从子组件传递过来
    handleTabsItemChange(e) {
      // 获取被点击的标题索引
      const {index} = e.detail;
      // 2 修改原数组
      let {tabs} = this.data;
      tabs.forEach((v,i)=>i===index?v.isActive=true:v.isActive=false);
      // 赋值到data中
      this.setData({
        tabs
      })
    },
    // 点击 "+" 选择图片事件
    handleChooseImg() {
      // 2 调用小程序内置的选择图片api
      wx.chooseImage({
        // 同时选中图片的数量
        count: 9,
        // 图片的格式   原图  压缩 
        sizeType: ['original','compressed'],
        // 图片的来源  相册  相机
        sourceType: ['album','camera'],
        success: (result)=>{
          console.log(result);
          this.setData({
            // 图片数组 进行拼接
            chooseImgs: [...this.data.chooseImgs,...result.tempFilePaths]
          })
        }
      });
    },
    // 点击自定义图片组件
    handleRemoveImg (e) {
      //2 获取被点击的组件的索引
      const {index} = e.currentTarget.dataset;
      // 3 获取data中的图片数组
      let {chooseImgs} = this.data;
      // 4 删除元素
      chooseImgs.splice(index,1);
      this.setData({chooseImgs});
    },
    // 文本域的输入事件
    handleTextInput(e) {
      this.setData({
        textVal:e.detail.value
      })
    },
    // 提交按钮点击
    handleFromSubmit() {
      // 1 获取文本域的内容  图片数组
      const {textVal,chooseImgs} = this.data;
      // 2 合法性的验证
      if(!textVal.trim()) {
        // 不合法
        wx.showToast({
          title: '输入不合法',
          icon: 'none',
          mask: true
        });
        return;
      }
      // 3 准备上传图片 到专门的图片服务器
      // 上传文件 api 不支持  多个文件同时上传   遍历数组  挨个上传
      // 显示正在等待的图标
      wx.showLoading({
        title: '正在上传中',
        mask:true
      })
      // 判断有没有需要上传的图片数组
      if(chooseImgs.length!=0) {
        chooseImgs.forEach((v,i) => {
          wx.uploadFile({
            // 图片要上传到哪里
            url: 'https://imgchr.com/', 
            // 被上传的文件的路径
            filePath: v,
            // 上传文件的名称  后台来获取文件
            name: 'file',
            // 顺带的文本信息
            formData: {},
            success: (result) => {
              console.log(result);
              // let url = JSON.parse(result.data).url;
              let url = result.data;
              // console.log(url);
              this.UpLoadImgs.push(url);
              // 所有的图片都上传完毕触发
              if(i===chooseImgs.length-1) {
                wx-wx.hideLoading()
                // 最后一个图片上传完毕
                console.log("把文本的内容以及外网图片的路径数组  提交到后台中");
                // 提交成功了
                // 重置页面
                this.setData({
                  textVal:"",
                  chooseImgs: []
                })
                // 返回上一个页面
                wx-wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        });
      } else {
        console.log("没有选择图片，只提交了文本");
        wx-wx.hideLoading();
        wx-wx.navigateBack({
          delta: 1
        })
      }
    }
})