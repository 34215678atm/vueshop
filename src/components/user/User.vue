<template>
  <div>
    <!-- 用户导航图区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户卡片视图区域 -->
    <el-card class="box-card">
      <!-- 用户搜索区域 -->
      <!-- el-row 代表行 ， el-col  代表列， :gutter 可以指定每行的间距，:span可以指定每列的宽度 -->
      <!--  -->
      <el-row :gutter="20">
        <el-col :span="7">
          <!-- clearable 在文本框后面加删除内容按钮 -->
          <el-input
            ref="msgInput"
            placeholder="请输入内容"
            v-model="userinfo.query"
            clearable
          >
            <!-- 因为查询时，如果切换了页码，那么就会从当前页码往后查找数据，这样就查不出当前页码之前的数据了，所以需要每次查询之前给页码清零 -->
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="
                userinfo.pagenum = 1;
                getUserList();
              "
            ></el-button>
          </el-input>
        </el-col>
        <!-- 重置按钮 -->
        <el-col :span="2">
          <el-button type="info" @click="cleanUser"> 重置 </el-button>
        </el-col>
        <!-- 添加用户按钮 -->
        <el-col :span="4">
          <!-- @click="addDialogVisible=true" 给按钮绑定了单击事件，此时点击按钮弹出对话框 -->
          <el-button type="primary" @click="addDialogVisible = true">
            添加用户
          </el-button>
        </el-col>
      </el-row>
      <!-- 用户列表页 -->
      <el-table :data="userList" border stripe>
        <!-- 列表页数据排序序号 -->
        <el-table-column type="index" label="#"> </el-table-column>
        <el-table-column prop="username" label="姓名"> </el-table-column>
        <el-table-column prop="email" label="邮箱"> </el-table-column>
        <el-table-column prop="mobile" label="手机号"> </el-table-column>
        <el-table-column prop="role_name" label="角色"> </el-table-column>
        <el-table-column prop="mg_state" label="状态">
          <!-- 作用于插槽获得element中的数据 -->
          <template slot-scope="scope">
            <!-- {{ scope.row.mg_state }} -->
            <!-- 开关 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 这是修改按钮 -->
            <!-- 绑定了编辑用户的展示对话框的事件 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 这是删除按钮 -->
            <!-- 绑定了删除用户的事件 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 这是分配角色按钮 -->
            <!-- tooltip 是鼠标放上去时显示的文本 -->
            <el-tooltip effect="dark" content="分配角色" placement="top">
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="showSetRoleDialog(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="userinfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="userinfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户的对话框 -->
    <!-- @close 指定了dialog关闭时要执行的函数，可以在函数里重置对话框为初始状态，这样每次打开对话框，状态都是初始的 -->
    <el-dialog
      title="添加用户"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClose"
    >
      <!-- span是对话框的主体区域 -->
      <div>
        <!-- 添加用户表单 -->
        <!-- 必须用:model="addUserInfo" 绑定数据源，不然规则校验会有BUG -->
        <el-form
          ref="addUserForm"
          :model="addUserInfo"
          :rules="addUserRules"
          label-width="80px"
        >
          <!-- 这是用户名称区域 -->
          <el-form-item label="用户名称" prop="username">
            <el-input
              placeholder="请输入用户名称"
              v-model="addUserInfo.username"
            ></el-input>
          </el-form-item>
          <!-- 这是用户密码区域 -->
          <el-form-item label="用户密码" prop="password">
            <el-input
              placeholder="请输入用户密码"
              type="password"
              v-model="addUserInfo.password"
            ></el-input>
          </el-form-item>
          <!-- 这是邮箱区域 -->
          <el-form-item label="邮箱" prop="email">
            <el-input
              placeholder="请输入邮箱"
              v-model="addUserInfo.email"
            ></el-input>
          </el-form-item>
          <!-- 这是手机号区域 -->
          <el-form-item label="手机号" prop="mobile">
            <el-input
              placeholder="请输入手机号"
              v-model="addUserInfo.mobile"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <!-- 底部-这个span是俩个按钮的区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户信息"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClose"
    >
      <!-- 修改用户表单 -->
      <div>
        <!-- 添加用户表单 -->
        <!-- 必须用:model="addUserInfo" 绑定数据源，不然规则校验会有BUG -->
        <el-form
          ref="editUserForm"
          :model="editUserData"
          :rules="addUserRules"
          label-width="80px"
        >
          <!-- 这是用户名称区域 -->
          <el-form-item label="用户名称">
            <el-input v-model="editUserData.username" disabled></el-input>
          </el-form-item>
          <!-- 这是邮箱区域 -->
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editUserData.email"></el-input>
          </el-form-item>
          <!-- 这是手机号区域 -->
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="editUserData.mobile"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUSer(editUserData.id)"
          >确 定</el-button
        >
      </span>
    </el-dialog>
    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleClose"
    >
      <!-- 当前的用户和角色 -->
      <div>
        <p>当前的用户：{{ userinfoRole.username }}</p>
        <p>当前的角色：{{ userinfoRole.role_name }}</p>
        <p>
          分配的角色：
          <!-- 下拉列表， -->
          <!-- 选择哪一项时， v-model 绑定的变量中就存放哪一个值
             ，值为 绑定的 :value ，也就是角色ID-->
          <el-select v-model="selectRole" placeholder="请选择">
            <el-option
              v-for="item in roles"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="setRole"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>


<script>
export default {
  data() {
    // 设置邮箱的自定义规则校验
    var checkEmail = (rule, value, cb) => {
      const regEmail =
        /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("请输入合法的邮箱"));
    };
    return {
      // post 请求参数，是一个对象,添加用户参数,请求添加用户
      addUserInfo: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      // 将用户数据渲染到列表中的请求参数
      userinfo: {
        query: "",
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 2,
      },
      // 存储的是用户数据，是数组，数组中是一个一个对象
      userList: [],
      // 数据的总条数
      total: 0,
      // 用来判断添加用户对话框是否显示的变量
      addDialogVisible: false,
      // 给添加用户文本框加校验
      addUserRules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 10, message: "长度在 3 到 10个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 6, max: 10, message: "长度在 6 到 10个字符", trigger: "blur" },
        ],
        email: [
          { required: false },
          // 设置邮箱的自定义规则校验
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: false },
          { min: 11, max: 11, message: "手机号必须为11位", trigger: "blur" },
        ],
      },
      //用来判断修改用户对话框是否显示的变量
      editDialogVisible: false,
      // 存放的是根据ID查询出来的用户数据
      editUserData: {},
      // 用来判断分配角色对话框是否显示
      setRoleDialogVisible: false,
      // 存放当前一行的用户信息
      userinfoRole: {},
      // 存放所有的角色信息
      roles: [],
      // 保存下拉框中选中的角色
      selectRole:'',
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户数据，并存入userList中
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.userinfo,
      });
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取用户信息失败!");
      this.userList = res.data.users;
      this.total = res.data.total;
    },
    // 改变一页显示多少行数据
    handleSizeChange(newPageSize) {
      this.userinfo.pagesize = newPageSize;
      this.getUserList();
    },
    // 点击页数会跳转到具体页
    handleCurrentChange(newPage) {
      this.userinfo.pagenum = newPage;
      this.getUserList();
    },
    // 当在页面中更改状态时会执行这个函数，发送请求给服务器。然后将更改后的用户状态存入数据库中
    async userStateChange(userStateCHange) {
      const { data: res } = await this.$http.put(
        "users/" + userStateCHange.id + "/state/" + userStateCHange.mg_state
      );
      if (res.meta.status !== 200) return this.$message.error("系统出错");
      this.$message.success(res.meta.msg);
    },
    // 重置用户列表页
    cleanUser() {
      // 将文本框清空
      this.userinfo.query = "";
      this.userinfo.pagenum = 1;
      this.userinfo.pagesize = 2;
      this.getUserList();
    },
    // 添加用户
    addUser() {
      // validate 实现表单的预校验
      this.$refs.addUserForm.validate(async (valid) => {
        console.log(valid);
        // 如果校验失败，则return
        if (!valid) return;
        // 如果校验成功，则执行下条语句
        const { data: res } = await this.$http.post("users", this.addUserInfo);
        // 如果请求失败，则提示错误信息
        if (res.meta.status !== 201) return this.$message.error("系统出错");
        // 如果请求发送成功，点击确定后应该关闭对话框
        this.addDialogVisible = false;
        // 添加用户完成后应该直接将新数据渲染到页面上，不应该按下刷新才显示
        this.getUserList();
        this.$message.success(res.meta.msg);
      });
    },
    // 监听对话框关闭时，是否清空添加用户表单
    addDialogClose() {
      this.$refs.addUserForm.resetFields();
    },
    // 展示编辑用户对话框，根据ID查询出数据，并将查询出的数据渲染到编辑页面
    async showEditDialog(id) {
      this.editDialogVisible = true;
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) return this.message.error("系统出错");
      this.editUserData = res.data;
    },
    // 监听对话框关闭时，是否清空修改用户表单
    editDialogClose() {
      this.$refs.editUserForm.resetFields();
    },
    // 修改用户
    editUSer(id) {
      this.$refs.editUserForm.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put("users/" + id, {
          email: this.editUserData.email,
          mobile: this.editUserData.mobile,
        });
        if (res.meta.status !== 200) return this.message.error("系统出错");
        // 如果请求发送成功，点击确定后应该关闭对话框
        this.editDialogVisible = false;
        // 添加用户完成后应该直接将新数据渲染到页面上，不应该按下刷新才显示
        this.getUserList();
        this.$message.success(res.meta.msg);
      });
    },
    // 删除用户
    // 根据ID删除用户的方法
    async removeUserById(id) {
      // 删除提示弹窗
      // 不加await 默认返回promise
      const confirmResult = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
          // catch 用来捕获取消时的异常
        }
      ).catch((err) => err);
      // 如果用户确定删除，则返回值为字符串 confirm
      // 如果用户取消删除，则返回值为字符串，cancel
      // console.log(confirmResult)
      // 如果 confirmResult!=='confirm' ，则用户点击了取消按钮
      if (confirmResult !== "confirm")
        return this.$message.info("您取消了删除");
      // 如果上一步没有return，则执行下一步
      // 发送删除请求，参数为用户的ID
      const { data: res } = await this.$http.delete("users/" + id);
      // 如果删除失败，则弹出message框
      if (res.meta.status !== 200)
        return this.$message.error("系统异常,删除失败");
      // 如果删除成功，需要执行获取用户数据的方法，让新的数据重新渲染
      this.getUserList();
      // 新数据渲染完成后，弹窗提示删除成功
      this.$message.success(res.meta.msg);
    },
    // 显示分配角色对话框
    async showSetRoleDialog(userinfo) {
      // 需要将该行数据存放至data中
      this.userinfoRole = userinfo;
      // 在展示对话框之前，获取所有角色
      const { data: res } = await this.$http.get("roles");
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取角色信息失败");
      // 保存所有的角色信息
      this.roles = res.data;
      // 显示对话框
      this.setRoleDialogVisible = true;
    },
    // 角色授权
    async setRole(){
      // 判断角色下拉框是否为空，如果为空则提示信息
      if(!this.selectRole)  return this.$message.error('请选择角色');
      // 发送角色授权请求，参数为用户ID，和角色ID
      const {data:res}=await this.$http.put('users/'+this.userinfoRole.id+'/role',{rid:this.selectRole});
      if(res.meta.status!==200) return this.$message.error('系统错误，角色授权失败！');
      // 重新渲染页面，拿到最新的数据
      this.getUserList();
      this.$message.success(res.meta.msg);
      // 点击确认，对话框关闭
      this.setRoleDialogVisible=false;
    },
    // 监听分配角色对话框的关闭
    setRoleClose(){
      // 对话框关闭时，下拉框重置为初始状态
      this.selectRole='';
    }
  },
};
</script>

<style lang="less" scoped>
</style>