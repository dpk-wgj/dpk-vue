import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
import NProgress from 'nprogress'//页面顶部进度条
import 'nprogress/nprogress.css'

import Login from './pages/Login.vue'
import Home from './pages/Home.vue'
import Main from './pages/Main.vue'
import Table from './pages/nav1/Table.vue'
import Form from './pages/nav1/Form.vue'
import user from './pages/nav1/user.vue'
import Page4 from './pages/nav2/Page4.vue'
import Page5 from './pages/nav2/Page5.vue'
import Page6 from './pages/DriverInfo/driver.vue'
import CarLocation from './pages/CarLocationInfo/CarLocation/index.vue'
import CarTrack from './pages/CarLocationInfo/CarTrack/index.vue'
import AdminInfo from './pages/AdminInfo/index.vue'
import CarManage from './pages/CarManage/index.vue'
import OrderList from './pages/OrderManage/OrderList/index.vue'
import OrderComplaint from './pages/OrderManage/OrderComplaint/index.vue'
import OrderStatistics from './pages/OrderManage/OrderStatistics/index.vue'

import echarts from './pages/charts/echarts.vue'
// start mock
import Mock from './mock';
// Mock.bootstrap();
import AMap from 'vue-amap'
Vue.use(AMap)
AMap.initAMapApiLoader({
  key: 'a4d5be4201b602022f2850dc370ef6f4',
  plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
  uiVersion: '1.0.11' // 版本号
})

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

NProgress.configure({ showSpinner: false });

const routes = [
  {
    path: '/login',
    component: Login,
    hidden: true//不显示在导航中
  },
  {
    path: '/',
    component: Home,
    name: '',
    iconCls: 'fa fa-bar-chart',
    leaf: true,//只有一个节点
    children: [
      { path: '/carManage', component: CarManage, name: '车辆管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '订单管理',
    iconCls: 'fa fa-bar-chart',
    children: [
      { path: '/order/list', component: OrderList, name: '订单检索' },
      { path: '/order/complaint', component: OrderComplaint, name: '投诉处理' },
      { path: '/order/statistics', component: OrderStatistics, name: '数据统计' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '管理用户管理',
    iconCls: 'fa fa-bar-chart',
    children: [
      { path: '/adminInfo', component: AdminInfo, name: '管理用户管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '车辆定位',
    iconCls: 'fa fa-bar-chart',
    children: [
      { path: '/CarLocation', component: CarLocation, name: '位置查询' },
      { path: '/CarTrack', component: CarTrack, name: '历史轨迹查询' }
    ]
  },
  //{ path: '/main', component: Main },
  {
    path: '/',
    component: Home,
    name: '导航一',
    iconCls: 'el-icon-message',//图标样式class
    children: [
      //{ path: '/main', component: Main },
      { path: '/table', component: Table, name: 'Table' },
      { path: '/form', component: Form, name: 'Form' },
      { path: '/user', component: user, name: '列表' },
    ]
  },
  {
    path: '/',
    component: Home,
    name: '导航二',
    iconCls: 'fa fa-id-card-o',
    children: [
      { path: '/page4', component: Page4, name: '页面4' },
      { path: '/page5', component: Page5, name: '页面5' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: '司机管理',
    iconCls: 'fa fa-address-card',
    children: [
      { path: '/driver', component: Page6, name: '司机管理' }
    ]
  },
  {
    path: '/',
    component: Home,
    name: 'Charts',
    iconCls: 'fa fa-bar-chart',
    children: [
      { path: '/echarts', component: echarts, name: 'echarts' }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  NProgress.start();
  next()
})

router.afterEach(transition => {
  NProgress.done();
});

new Vue({
  el: '#app',
  template: '<App/>',
  router,
  store,
  components: { App }
  //render: h => h(Login)
}).$mount('#app')

//router.replace('/login')

