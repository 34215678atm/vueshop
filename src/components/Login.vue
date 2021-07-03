<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 这是头像区域 -->
      <div class="avater_box">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 这是登录表单区域，引用elemengtUI中的组件 -->
      <!-- :model用于绑定数据，label-width指定表单标签的宽度，:rules给文本框绑定输入数据
                            合法性验证规则验证-->
      <!--通过   ref="loginFormRef"  这个属性可以获得这个表单元素  -->
      <el-form
        ref="loginFormRef"         
        :model="loginForm"
        label-width="80px"
        class="login_form"
        :rules="loginFromRules"
      >
        <!-- 这是用户名标签 -->
        <!-- prop用来绑定设置的校验规则 -->
        <el-form-item prop="username" label="用户名:">
          <el-input
            v-model="loginForm.username"
            prefix-icon="iconfont icon-Profile"
          ></el-input>
        </el-form-item>
        <!--这是密码标签  -->
        <el-form-item prop="password" label="密码:">
          <el-input
            v-model="loginForm.password"
            type="password"
            prefix-icon="iconfont icon-mima"
          ></el-input>
        </el-form-item>
        <!-- 这是按钮区域 -->
        <el-form-item>
          <el-row class="btns">
            <el-button type="primary" @click="login">登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
// import Loginbox from './Loginbox.vue'
export default {
  data() {
    return {
      loginForm: {
        username: "", //elementUI对文本框标签数据的绑定
        password: "",
      },
      loginFromRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10个字符", trigger: "blur" },
        ], //elementUI对文本框标签输入数据是否合法的检验
      },
    };
  },
  methods:{
    //   点击重置按钮重置表单，包括验证信息
      resetLoginForm(){
          console.log(this);
          this.$refs.loginFormRef.resetFields()                     //低版本的用resetFields()方法。用resetField()
          //会报错
      },
      login(){
          // async 和 await 的使用可以使我们访问到服务器上真实的数据
          this.$refs.loginFormRef.validate(async valid=>{             //验证结束后回调这个箭头函数，若预验证成功
                                                                //valid为True,否则为False
              console.log(valid);
              if(!valid) return;
              //{data:res} 用到的是ES6的解构语法
              const {data:res}=await this.$http.post('login',this.loginForm);
              console.log(res);
              if(res.meta.status!=200) return this.$message.error("登录失败!") ; //使用eleUI的message消息弹窗，失败
              this.$message.success("登录成功");     //使用eleUI的message消息弹窗，成功
              window.sessionStorage.setItem('token',res.data.token);
              this.$router.push('/home')
          })
      }
  },
  components: {},
};
</script>

<style lang="less" scoped>
.login_container {
  background-color: blue;
  height: 100%;
}
.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%; //设置偏移量，即居中
  top: 50%; //设置偏移量，即居中
  transform: translate(-50%, -50%); //设置偏移量，即居中
  .avater_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee; //边框以及边框颜色
    border-radius: 50%; //圆角
    padding: 10px; //内边距
    box-shadow: 0 0 10px #ddd; //设置阴影，向外暴露10PX
    position: absolute;
    left: 50%;
    transform: translate(
      -50%,
      -50%
    ); //后一个参数的百分比是由盒子avater_box的高度为标志向上或向下移动的
    //拿到的是130px/2=75px
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end; //控制按钮往右边贴，给按钮区域加上了弹性模型.justify-content属性控制了横向布局
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0px 10px; //这样设置会超出表单区域范围。
  box-sizing: border-box;
}
</style>