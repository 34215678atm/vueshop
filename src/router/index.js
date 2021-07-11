import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import HomeMain from '../components/HomeMain.vue'
import User from '../components/user/User.vue'
Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    redirect:'/login'
  },
  {
    path:'/login',
    component:Login
  },
  {
    path:'/home',
    component:Home,
    redirect:'/hello',
    // 写完之后需要去父组件Home中使用一个坑来显示子组件
    children:[
      {
        path:'/hello',
        component:HomeMain
      },
      {
        path:'/users',
        component:User
      }
    ]
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})
// 为路由对象添加导航守卫。作用是控制页面访问权限
router.beforeEach((to,from,next)=>{
  //如果用户访问登录页，直接放行
  if(to.path==='/login') return next();
  //从window中获取token的值
  const tokenStr= window.sessionStorage.getItem('token');
  //如果token没有传过来，说明用户已退出当前账号，或者登录信息失效，这时强制我们返回登录页重新登录
  if(!tokenStr) return next('/login');
  //如果有token，则直接放行
  next()
})
export default router
