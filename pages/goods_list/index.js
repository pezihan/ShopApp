/*
  1 用户上滑页面 滚动条触底 开始加载下一页数据
    1 找到滚动条触底事件
    2 判断还有没有下一页数据
      1 获取到总页数  只有总条数
        总页数 Math.ceil(总条数 / 也容量)  向上取整函数
      2 获取到当前页码 pagenum   
      3 判断一下 当前页面是否大于或则等于 总页数
        > 表示 每页下一页数据

    3 假如没有下一页数据  弹出一个提示框
    4 假如还有下一页数据  来加载下一页数据
*/ 
import {request} from "../../request/index.js"
import regeneratorRuntime from "../../lib/runtime/runtime"
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "综合",
        isActive: true
      },
      {
        id: 1,
        value: "销量",
        isActive: false
      },
      {
        id: 2,
        value: "价格",
        isActive: false
      },
    ],
    // 商品列表数据
    goodsList:[]
  },
  // 接口要的参数
  QueryParams:{
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,
  onLoad: function (options) {
    this.QueryParams.cid=options.cid||"";
    this.QueryParams.query=options.query||"";
    this.getGoodsLit()
  },
  // 获取商品列表数据
  async getGoodsLit() {
    const res = await request({url: "/goods/search",data:this.QueryParams})
    // 获取 总条数
    const total = res.total
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList,...res.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },
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
  // 页面上滑  滚动条触底事件 
  onReachBottom() {
    // console.log("触底");
    // 判断还有没有下一页数据
    if(this.QueryParams.pagenum >= this.totalPages) {
      // 每页下一页数据了
      // console.log("没有下一页数据了");
      wx.showToast({title: '没有下一页数据'});
    } else {
      // 还有下一页数据
      // console.log("还有下一页数据", this.totalPages);
      this.QueryParams.pagenum++;
      this.getGoodsLit()
    }
  },
  // 下拉刷新事件
  onPullDownRefresh() {
    //1 重置数组
    this.setData({
      goodsList: []
    })
    // 2 重置页码
    this.QueryParams.pagenum = 1;
    // 3 重新发送请求
    this.getGoodsLit();
  }
})