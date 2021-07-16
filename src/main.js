import Vue from 'vue'
import App from './App.vue'
import router from './router'
//导入elemengtui组件
import './plugins/element.js'
//导入全局的css文件
import './assets/css/global.css'
//导入阿里图标
import './assets/fonts/iconfont.css'
// 导入TreeTable组件
import TreeTable from 'vue-table-with-tree-grid'
// 导入富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑器对应的样式表
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme
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


// 使用富文本编辑器
Vue.use(VueQuillEditor, /* { default global options } */)

//将axios加到Vue的属性中去，这样我们可以全局使用$http
Vue.prototype.$http=axios
Vue.config.productionTip = false
// 全局注册树状表格组件
Vue.component('tree-table',TreeTable)
// 定义全局过滤器
// dateInfo 为使用这个过滤器的|前面的数据
Vue.filter('dateFormat',function(dateInfo){
  const date=new Date(dateInfo);
  // 年月日
  const y=date.getFullYear();
  const m=(date.getMonth()+1+'').padStart(2,'0');
  const d=(date.getDate()+'').padStart(2,'0');

  // 时分秒
  const hh=(date.getHours()+'').padStart(2,'0');
  const mm=(date.getMinutes()+'').padStart(2,'0');
  const ss=(date.getSeconds()+'').padStart(2,'0');
  return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
