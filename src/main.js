import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入elemengtui组件
import './plugins/element.js'
//导入全局的css文件
import './assets/css/global.css'
//导入阿里图标
import './assets/fonts/iconfont.css'
//导入axios
import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL='http://127.0.0.1:8888/api/private/v1/'
//axios加载拦截器
axios.interceptors.request.use(config => {
  
  config.headers.Authorization=window.sessionStorage.getItem('token')
  return config
  // 最后必须加上  return config   ，这是固定写法
})

//将axios加到Vue的属性中去，这样我们可以全局使用$http
Vue.prototype.$http=axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
