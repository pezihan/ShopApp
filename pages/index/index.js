// 0 引入 用来发送请求的  方法  一定要把路径补全
import {request} from "../../request/index.js";
Page({
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数据
    catesList: [],
    // 楼层数据
    floorList: []
  },
  // 页面开始加载的时候触发
  onLoad: function(options){
    // 发送异步请求获取轮播图数据   优化的手段可以通过es6的 promise来解决这个问题
    // var reqTask = wx.request({
    //   url: 'https://api-hmugo-web.itheima.net/api/public/v1/home/swiperdata',
    //   success: (result) => {
    //     // console.log(result);
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   }
    // })
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },
  // 获取轮播图数据
  getSwiperList() {
    request({url:"/home/swiperdata"})
      .then(result => {
        this.setData({
          swiperList: result
        })
    }) 
  },
  // 获取分类导航数据
  getCateList() {
    request({url:"/home/catitems"})
      .then(result => {
        this.setData({
          catesList: result
        })
    }) 
  },
  // 获取 楼层数据
  getFloorList() {
    request({url:"/home/floordata"})
      .then(result => {
        let floorList = result;
        floorList.forEach(v => {
          v.product_list.forEach(v => {
            v.navigator_url = v.navigator_url.replace(/goods_list/,"goods_list/index")
          })
        })
        this.setData({
          floorList: floorList
        })
    }) 
  },
});