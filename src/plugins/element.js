import Vue from 'vue'
import { Button,Form,FormItem,Input,Row,Message } from 'element-ui'   //必须按需导入element UI组件
 
Vue.use(Button)
Vue.use(Form)    //导入组件后必须组成组件
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Row)
//Message 需要全局导入到Vue实例中去，这样我们每个组件都能用$message来弹窗
Vue.prototype.$message=Message