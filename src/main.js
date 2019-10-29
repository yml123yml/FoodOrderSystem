
//导入vue
import Vue from 'vue'
// 导入App根组件
import app from './App.vue';



//导入路由器
import VueRouter from 'vue-router';
//使用路由器
Vue.use(VueRouter);
//导入vue-resource
import VueResource from 'vue-resource';
Vue.use(VueResource);

//导入自己写好的router
import router from '../router.js'


// 导入mui样式表
// import './lib/mui/css/mui.min.css';
import '../static/css/iconfont.css';



// 创建vue实例
var vue = new Vue({
  el:'#app',
  render:c => c(app),
  router //vue挂载router
});