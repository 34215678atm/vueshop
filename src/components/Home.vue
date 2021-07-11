<template>
  <!-- 如果这里用一层DIV 包裹起来,设置高度为100% 时,无法充满 -->
  <el-container class="el-containerStyle">
    <!-- 页面头部 -->
    <el-header>
      <div>
        <img src="../assets/shop.jpg" alt="" />
        <span>电商管理系统</span>
      </div>
      <el-button type="info" @click="logout"> 退出 </el-button>
    </el-header>
    <el-container>
      <!-- 页面左侧菜单项 -->
      <!-- :width="isCollapse ? '64px':'200px'"    设置了折叠时宽带自动变化的功能 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <!-- 设置点击三条竖线展开菜单 -->
        <div class="toggle-button" @click="toggleCollSpace">|||</div>
        <!-- 侧边菜单区域 -->
        <!--unique-opened 设置只能展开一个菜单  -->
        <!-- collapse 是否水平折叠收起菜单 -->
        <!-- collapse-transition  取消了折叠动画-->
        <!-- :router="true" 启用了路由模式  -->
        <!-- :default-active="activePath"   这用于动态绑定点击子菜单高亮的index   
          default-active后面传那个菜单的index那个菜单就高亮 -->
        <el-menu
          background-color="#373d41"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="true"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <!--key需要用:   绑定  ;index需要指定唯一的值，不然列表页会一起展开。所以需要使用动态数据绑定 -->
          <el-submenu
            :index="item.id + ''"
            v-for="item in menulist"
            :key="item.id"
          >
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <!-- 每次循环都会取出一个一级菜单对象，该对象上有唯一属性id ，我们可以通过这个id对相应的一级菜单做操作 -->
              <!-- 将iconsObj这个对象动态绑定到class上，每次传入一个唯一的id，可以通过这个id找到iconsObj中的具体icon图标 -->
              <i :class="iconsObj[item.id]"></i>
              <!-- 文本 -->
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <!-- el-menu-item  需要在element.js  中导入MenuItem-->
            <!-- 这里绑定的index必须要用  itemc.id+'' 这种形式来绑定，因为后端穿的是string-->
            <!-- :index="'/'+itemc.path+''"  路由模式会以index传的值为hash跳转-->
            <!-- @click="saveNavStates('/' + itemc.path)"   绑定了一个方法，里面传入了index的值
             -->
            <el-menu-item
              :index="'/' + itemc.path"
              v-for="itemc in item.children"
              :key="itemc.id"
              @click="saveNavStates('/' + itemc.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ itemc.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 页面主体区域 -->
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menulist: [],
      // 通过id获取相应的图标，并动态绑定到class上
      iconsObj: {
        125: "iconfont icon-users",
        103: "iconfont icon-tijikongjian",
        101: "iconfont icon-huopin",
        102: "iconfont icon-dianpu",
        145: "iconfont icon-baobiao",
      },
      isCollapse: false,
      activePath:''
    };
  },
  // 左侧菜单栏应该在页面一加载时，就自动渲染好了数据。
  //组件的生命周期函数，组件一创建好了，就会回调这个函数
  created() {
    this.getMeunList();
    // 存入本地中去后，会执行getitem方法将activePath取出来并赋值给DATA中的activePath变量
    this.activePath=window.sessionStorage.getItem('activePath')
  },
  methods: {
    logout() {
      //清除浏览器本地中的sessionStorage中的所有信息，包括登陆成功后传递的token
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    async getMeunList() {
      const { data: res } = await this.$http.get("menus");
      console.log(res);
      // 判断是否成功获取了菜单列表数据
      if (res.meta.status !== 200) return this.$message.error(res.meta.msg);
      // 如果拿到了菜单列表数据，赋值给menulist， res.data 是一个数组
      this.menulist = res.data;
    },
    // 设置三条竖线点击事件
    toggleCollSpace() {
      this.isCollapse = !this.isCollapse;
    },
    // 调用这个函数，会将当前电机的菜单的index存入sessionStorage中去
    // 存入本地中去后，会执行getitem方法将activePath取出来并赋值给DATA中的activePath变量
    saveNavStates(activePath){
      // 如果不保存到本地浏览器中，每次浏览器回退就不能记住上一次点击的菜单，并高亮显示
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath=activePath
    }
  },
};
</script>

<style lang="less" scoped>
.el-containerStyle {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  display: flex;
  justify-content: space-between; //flex左右贴边对齐
  padding-left: 0px; //左内边距设置0
  align-items: center; //让按钮居中的
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    img {
      width: 60px;
      height: 50px;
      border-radius: 20%;
      margin-right: 10px;
    }
  }
}
.el-aside {
  background-color: #373d41;
  .el-menu {
    border-right: none; //解决选中子菜单时对不齐的问题
  }
}
.el-main {
  background-color: #eaedf1;
}
.iconfont {
  margin-right: 10px;
}
.toggle-button {
  background-color: #4a5064;
  font-size: 10px;
  line-height: 24px;
  color: #fff;
  text-align: center;
  letter-spacing: 0.2em; //设置三条竖线之间间距的属性
  cursor: pointer; //让鼠标放到三条竖线上去有小手的标志
}
</style>