<template>
  <div>
    <!-- 头部导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card">
      <!-- 添加角色 -->
      <el-button type="primary">添加角色</el-button>
      <!-- 角色数据表格 -->
      <el-table :data="roleDataList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <!-- 作用域插槽绑定一行的数据 -->
          <template slot-scope="scope">
            <!-- for循环获取第一层孩子 -->
            <!-- 栅格布局 -->
            <!--使用 :class="['bdbottom',i1===0?'bdtop':'']" 动态绑定类  -->
            <el-row
              :class="['bdbottom', i1 === 0 ? 'bdtop' : '']"
              v-for="(oneRights, i1) in scope.row.children"
              :key="oneRights.id"
            >
              <!-- 一级权限 -->
              <el-col :span="5">
                <!-- 设置closable属性可以定义一个标签是否可移除  -->
                <el-tag closable @close="deleteRights(scope.row, oneRights.id)">
                  <!-- 获取到的一级权限名 -->
                  {{ oneRights.authName }}
                </el-tag>
                <!-- 每个一级权限后面的小图标 -->
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 二级权限 -->
              <el-col :span="19">
                <!-- 可以在一级权限的一行上 创建多行二级权限 -->
                <!-- i2 !== (oneRights.children.length-1) ? 'bdbottom' : ''  判断是否循环到了最后一个，如果是最后则不加下边框，如果没到则加下边框 -->
                <el-row
                  :class="[
                    i2 !== oneRights.children.length - 1 ? 'bdbottom' : '',
                  ]"
                  v-for="(twoRights, i2) in oneRights.children"
                  :key="twoRights.id"
                >
                  <!-- 二级权限左侧 -->
                  <el-col :span="6">
                    <el-tag
                      type="success"
                      closable
                      @close="deleteRights(scope.row, twoRights.id)"
                      >{{ twoRights.authName }}</el-tag
                    >
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 二级权限右侧 ，即三级权限-->
                  <el-col :span="18">
                    <!-- 可以在二级权限的一行上 创建多行三级权限 -->
                    <el-tag
                      v-for="threeRights in twoRights.children"
                      :key="threeRights.id"
                      type="warning"
                      closable
                      @close="deleteRights(scope.row, threeRights.id)"
                    >
                      <!-- 三级权限 -->
                      <!-- <span>{{ threeRights.authName }}</span> -->
                      {{ threeRights.authName }}
                    </el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
            <!-- <pre>
                        {{scope.row}}
                    </pre> -->
          </template>
        </el-table-column>
        <!-- 普通列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作" prop="">
          <!-- 通过作用域插槽绑定了el表格中的数据 -->
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"
              >编辑</el-button
            >
            <el-button type="danger" icon="el-icon-delete" size="mini"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              size="mini"
              @click="showSetRightDialog(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <!-- 分配权限对话框 -->
    <el-dialog
      title="分配权限"
      :visible.sync="setDialogVisible"
      width="50%"
      @close="setRightsDialogClose"
    >
      <!-- 树状权限 -->
      <!-- data绑定数据源，props绑定这棵树节点的数据，如children 绑定每个下一级节点，label绑定每个结点的名字，这样就能循环出所有的节点了 -->
      <!-- show-checkbox 展示多选框  -->
      <!-- node-key='id' 每个树节点用来作为唯一标识的属性，整棵树应该是唯一的 -->
      <!-- :default-checked-keys 用来让已有的节点被默认选中的属性 -->
      <el-tree :data="treeRightList" :props="treeProps" show-checkbox node-key='id' default-expand-all :default-checked-keys="defKeys" ref="rightsTree"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoleRights"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 存放的角色列表数据
      roleDataList: [],
      // 设置分配权限对话框是否可见
      setDialogVisible:false,
      // 获取树状权限
      treeRightList:[],
      // 绑定树状权限的匹配规则
      treeProps:{
        children: 'children',
        label: 'authName'
      },
      // 设置默认勾选状态的节点
      defKeys:[],
      // 每次点击分配权限按钮，都要将角色ID保存到变量中，为number
      roleId:0,
    };
  },
  // 生命周期函数
  created() {
    // 组件一创建就执行下面函数
    this.getRoleList();
  },
  methods: {
    // 获取角色列表数据
    async getRoleList() {
      const { data: res } = await this.$http.get("roles");
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取角色信息失败");
      // 将角色数据保存到data中去
      this.roleDataList = res.data;
      // console.log(this.roleDataList)
    },
    // 删除角色权限
    async deleteRights(role, rightId) {
      // 弹窗提示是否确认删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该权限, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      // 如果取消删除会弹窗提示
      if (confirmResult !== "confirm")
        return this.$message.info("您取消了删除角色权限！");
      // 如果点击了确定则发送删除角色权限请求
      const { data: res } = await this.$http.delete(
        "roles/" + role.id + "/rights/" + rightId
      );
      if (res.meta.status !== 200)
        return this.$message.error("系统异常,删除失败");
      // 如果删除成功，则再次发送获取用户列表数据请求，获取最新用户数据
      // 如果再次发送获取角色数据请求，则展开列因为数据被重新渲染导致展开列会  合上，所以不能再次发起请求
      // this.getRoleList();
      // 这里是引用数据类型，不遵循值传递，改变参数的值，实参会跟着一起改变
      role.children = res.data;
      this.$message.success(res.meta.msg);
    },
    // 展示分配权限对话框
    // 接收用户ID
    async showSetRightDialog(role) {
      // 要将权限数据以树状图显示在对话框中，需要先获取权限的树状结构
      const {data:res}=await this.$http.get('rights/tree');
      if(res.meta.status!==200) return this.$message.error('系统错误，获取权限失败');
      //把获取到的树状权限保存到data中去
      this.treeRightList=res.data;
      // 将三级权限的所有ID保存到defKeys数组中去

      // 不能使用 for in  ，这样只能遍历出索引
      // console.log(role)
      // 使用循环遍历出所有的ID，并传入KEY中
      for(let r1 of role.children){
        for(let r2 of r1.children){
          for(let r3 of r2.children){
            this.defKeys.push(r3.id);
          }
        }
      };
      // 将用户ID存入data中
      this.roleId=role.id;
      // console.log(this.treeRightList);
      this.setDialogVisible=true;

    },
    // 关闭对话框
    setRightsDialogClose(){
      // 要将defKeys 中的数据清空，不然会显示上一级的数组的默认勾选
      this.defKeys=[];
    },
    // 添加角色权限
    async addRoleRights(){
      // 拿到选择的三级节点的ID，和拿到的一二级节点的ID
      const keys=[...this.$refs.rightsTree.getCheckedKeys(),...this.$refs.rightsTree.getHalfCheckedKeys()];
      // 打印节点值
      // console.log(keys);
      // 将每个数组元素以逗号拼接，存入字符串中去
      const idStr=keys.join(',');
      // 发起角色授权请求
      // console.log(idStr)
      const {data:res}=await this.$http.post('roles/'+this.roleId+'/rights',{rids:idStr});
      // 如果请求失败
      if (res.meta.status !== 200) return this.message.error("系统出错,角色授权失败！");
      this.$message.success(res.meta.msg);
      // 刷新列表
      this.getRoleList();
      // 关闭对话框
      this.setDialogVisible=false;
    }
  },
};
</script>

<style lang="less" scoped>
/* 设置el-tag 的边距 */
.el-tag {
  margin: 7px;
}
// 设置展开列每一行的上边框线
.bdtop {
  border-top: 2px solid #eee;
}
// 设置展开列每一行的下边框线
.bdbottom {
  border-bottom: 2px solid #eee;
}
.el-row {
  display: flex;
  align-items: center;
}
</style>