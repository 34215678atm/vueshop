import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import User from '../components/user/User.vue'
import Rights from '../components/power/Rights.vue'
import Wellcome from '../components/Wellcome.vue'
import Roles from '../components/power/Roles.vue'
import Cate from '../components/goods/Cate.vue'
import Params from '../components/goods/Params.vue'
import Good from '../components/goods/Good.vue'
import AddGood from '../components/goods/AddGood.vue'
Vue.use(VueRouter)

const routes = [
  {
    // 默认进入登录页面，默认将登录页渲染到App.vue上
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    // 主页面
    // 登录成功后，会push跳转到路径home,这时主页面的主体放在了Home中的坑里面去
    path: '/home',
    component: Home,
    redirect: '/hello',
    // 写完之后需要去父组件Home中使用一个坑来显示子组件
    // 主体页面，即为Home中的 <el-main> 区域
    children: [
      {
        // 这里的path需要与后端传的值一样
        // 这是默认进入的欢迎页面
        path: '/hello',
        component: Wellcome
      },
      {
        // 将用户页面替换主体区域
        path: '/users',
        component: User
      },
      {
        // 将权限页面替换主体区域
        path: '/rights',
        component: Rights
      },
      {
        // 将角色页面替换主体区域
        path: '/roles',
        component: Roles
      },
      {
        // 将商品分类页面替换主体区域
        path: '/categories',
        component: Cate
      },
      // 将分类参数页面替换主体区域
      {
        path: '/params',
        component: Params
      },
      // 将商品页面替换主体区域
      {
        path: '/goods',
        component: Good,
      },
      // 将添加商品页面替换主体区域
      {
        path: '/goods/add',
        component: AddGood,
      },
    ]
  }
]

const router = new VueRouter({
  routes,
  mode: 'history'
})
// 为路由对象添加导航守卫。作用是控制页面访问权限
router.beforeEach((to, from, next) => {
  //如果用户访问登录页，直接放行
  if (to.path === '/login') return next();
  //从window中获取token的值
  const tokenStr = window.sessionStorage.getItem('token');
  //如果token没有传过来，说明用户已退出当前账号，或者登录信息失效，这时强制我们返回登录页重新登录
  if (!tokenStr) return next('/login');
  //如果有token，则直接放行
  next()
})
export default router
