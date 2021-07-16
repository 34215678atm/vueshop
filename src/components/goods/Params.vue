<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <!-- 头部警告区域 -->
      <!-- closable 监测右侧的关闭按钮的显示 -->
      <!-- show-icon 展示左侧的图标-->
      <el-alert
        title="注意:只允许为第三级分类设置相关参数！"
        type="warning"
        :closable="false"
        show-icon
      >
      </el-alert>
      <!-- 选择商品分类区域 -->
      <el-row class="rowC">
        <el-col>
          <span> 选择商品分类：</span>
          <!-- 级联选择器 -->
          <el-cascader
            v-model="cateKeys"
            :options="cateList"
            :props="cateProps"
            @change="cateChange"
            ref="cateCasRef"
            clearable
          ></el-cascader>
        </el-col>
      </el-row>
      <!-- 标签页区域 -->

      <!-- activeName 指定了页面默认激活的标签 -->
      <!-- tab-click 监听tab被选中时触发的方法 -->
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <!-- 添加参数 -->
        <el-tab-pane label="动态参数" name="first">
          <!-- disabled 动态绑定属性，为true时按钮禁用，为false按钮可用 -->

          <!-- 按钮区域 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isOk"
            @click="addParDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 参数列表表格区域 -->
          <el-table :data="paramsList" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 展开行每一行的标签 -->
              <template slot-scope="scope">
                <!-- 循环遍历出每个参数的值，attr_vals -->
                <!-- 如果为空会有BUG -->

                <!-- @close 绑定了标签被删除时候执行的方法 -->
                <el-tag
                  v-for="(val, index) in scope.row.attr_vals
                    ? scope.row.attr_vals.split(',')
                    : []"
                  :key="index"
                  closable
                  @close="deleteTags(index, scope.row)"
                  >{{ val }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index" label="#"></el-table-column>
            <!-- 角色名称 -->
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <!-- 操作 -->
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <!-- 编辑 -->
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showDialog(scope.row)"
                  >编辑</el-button
                >
                <!-- 删除 -->
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <!-- 添加属性 -->
        <el-tab-pane label="静态属性" name="second">
          <!-- disabled 动态绑定属性，为true时按钮禁用，为false按钮可用 -->
          <el-button
            type="primary"
            size="mini"
            :disabled="isOk"
            @click="addParDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 参数列表表格区域 -->
          <el-table :data="paramsList" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <!-- 展开行每一行的标签 -->
              <template slot-scope="scope">
                <!-- 循环遍历出每个参数的值，attr_vals -->
                <!-- 如果为空会有BUG -->

                <!-- @close 绑定了标签被删除时候执行的方法 -->
                <el-tag
                  v-for="(val, index) in scope.row.attr_vals
                    ? scope.row.attr_vals.split(',')
                    : []"
                  :key="index"
                  closable
                  @close="deleteTags(index, scope.row)"
                  >{{ val }}</el-tag
                >
                <!-- 输入文本框 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 添加按钮 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>

            <!-- 操作 -->
            <el-table-column label="操作">
              <!-- 作用域插槽 -->
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showDialog(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="deleteParams(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>
    <!-- 添加参数对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addParDialogVisible"
      width="50%"
      @close="addParDialogClose"
    >
      <!-- 表单区域 -->
      <el-form
        :model="addParamsInfo"
        :rules="addParamsRules"
        ref="addParFormRef"
        label-width="100px"
      >
        <!-- 参数名称 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addParamsInfo.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改参数对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="addParDialogVisible2"
      width="50%"
      @close="addParDialogClose2"
    >
      <!-- 表单区域 -->
      <el-form
        :model="editQuerryP"
        :rules="addParamsRules"
        ref="addParFormRef2"
        label-width="100px"
      >
        <!-- 参数名称 -->
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editQuerryP.attr_name">{{
            editQuerryP.attr_name
          }}</el-input>
        </el-form-item>
      </el-form>
      <!-- 按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addParDialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品数据存放地址
      cateList: [],
      //存放每次选择的商品的ID值
      cateKeys: [],
      //存放级联选择器的匹配规则
      cateProps: {
        expandTrigger: "hover",
        label: "cat_name",
        value: "cat_id",
        children: "children",
      },
      //存放标签的激活状态
      activeName: "first",
      //   控制添加参数和添加属性按钮的禁用状态
      //   isOk: true,
      // 存储参数列表
      paramsList: [],
      // 监听对话框的显示与关闭
      addParDialogVisible: false,
      // 请求参数
      addParamsInfo: {
        // 参数名称
        attr_name: "",
        // 参数类型 ---静态OR动态
        // 在标签页改变时，被赋值
        attr_sel: "",
        // 如果是动态，则需要写
        // attr_vals:''
      },
      //  表单验证规则
      addParamsRules: {
        // 参数名匹配规则
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
          {
            min: 3,
            max: 15,
            message: "长度在 3 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
      // 监听编辑对话框的关闭
      addParDialogVisible2: false,
      // 编辑请求参数
      editQuerryP: {
        id: 0,
        attr_id: 0,
        attr_name: "",
        attr_sel: "many",
      },
      // 控制是否显示按钮，还是输入框
      // inputVisible: false,
      // 双向绑定的输入框的文本
      // inputValue: "",
    };
  },
  created() {
    this.getCateList();
  },
  methods: {
    //发送获取商品分类数据的请求 ，获取所有数据
    async getCateList() {
      // 发送获取商品请求
      const { data: res } = await this.$http.get("categories", {});
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取商品分类信息失败！");
      // 保存获取的商品数据
      this.cateList = res.data;
    },
    // 监听商品分类节点改变
    cateChange() {
      // 点击折叠项，级联选择器被收起
      // this.$refs.cateCasRef.dropDownVisible=false;
      // console.log(this.cateKeys);
      // 判断长度是否为3，不为3就清空keys数组

      if (this.cateKeys.length !== 3) {
        this.cateKeys = [];
        // this.isOk = true;
        // 当选择的是二级菜单时，需要将请求到的参数数组清空，以防前面选择过三级菜单，数据依然存在
        this.paramsList = [];
        return;
      }
      // 每次切换三级菜单，都要发起一次请求
      this.handleClick();
      //   this.isOk = false;
      //
    },
    // 监听标签页被选中
    handleClick() {
      // console.log("11111");
      // staticOrAuto保存的是请求的数据是何种类型的参数
      let staticOrAuto = "";
      // 对activeName监听
      if (this.activeName === "first") {
        staticOrAuto = "many";
        this.addParamsInfo.attr_sel = "many";
      } else {
        staticOrAuto = "only";
        this.addParamsInfo.attr_sel = "only";
      }
      // 判断是否选择的是三级菜单，如果不是，则不发起请求
      if (this.cateKeys.length === 3)
        this.getParamsList(this.cateKeys[2], staticOrAuto);
    },
    // 获取参数列表函数
    // id 为商品分类ID，sel为传递的参数，决定了请求的数据是动态，还是静态的
    async getParamsList(id, sel) {
      // 发起请求
      const { data: res } = await this.$http.get(
        "categories/" + id + "/attributes",
        { params: { sel: sel } }
      );
      // console.log(res.data)
      // 请求失败
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取参数信息失败");
      // 给每个参数对象上添加属性
      res.data.forEach((item) => {
        // 在保存参数对象之前，给每个参数对象新增了两个属性
        item.inputVisible = false;
        item.inputValue = "";
      });
      // console.log(res.data);
      // 保存参数列表数据
      this.paramsList = res.data;
      // console.log(this.paramsList)
    },
    // 监听对话框关闭
    addParDialogClose() {
      // 重置表单项
      this.$refs.addParFormRef.resetFields();
    },
    // 添加参数的函数
    addParams() {
      // 表单预验证
      this.$refs.addParFormRef.validate(async (valid) => {
        // 预校验失败，返回
        if (!valid) return;
        // 预校验成功执行下面语句
        const { data: res } = await this.$http.post(
          "categories/" + this.cateKeys[2] + "/attributes",
          this.addParamsInfo
        );
        // 判断是否请求成功
        // console.log(this.addParamsInfo)
        if (res.meta.status !== 201)
          return this.$message.error("系统错误，添加参数失败！");
        // 请求成功,弹窗提示
        this.$message.success(res.meta.msg);
        // 重新渲染页面，获取最新的数据
        this.handleClick();
        // 隐藏对话框
        this.addParDialogVisible = false;
      });
    },
    // 展示编辑对话框
    showDialog(params) {
      // 展示对话框之前，需要给请求参数赋值
      this.editQuerryP.id = params.cat_id;
      this.editQuerryP.attr_id = params.attr_id;
      this.editQuerryP.attr_name = params.attr_name;
      this.editQuerryP.attr_sel = params.attr_sel;
      // console.log(this.editQuerryP);
      // 展示对话框
      this.addParDialogVisible2 = true;
    },
    // 监听对话框关闭
    addParDialogClose2() {
      this.$refs.addParFormRef2.resetFields();
    },
    // 编辑参数
    editParams() {
      this.$refs.addParFormRef2.validate(async (valid) => {
        if (!valid) return;
        const { data: res } = await this.$http.put(
          "categories/" +
            this.editQuerryP.id +
            "/attributes/" +
            this.editQuerryP.attr_id,
          {
            attr_name: this.editQuerryP.attr_name,
            attr_sel: this.editQuerryP.attr_sel,
          }
        );
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("系统错误，编辑参数失败！");
        // 请求成功,弹窗提示
        this.$message.success(res.meta.msg);
        // 重新渲染页面，获取最新的数据
        this.handleClick();
        // 隐藏对话框
        this.addParDialogVisible2 = false;
      });
    },
    // 删除参数
    async deleteParams(params) {
      // 弹窗提示是否确认
      const confirmInfo = await this.$confirm(
        "此操作将永久删除参数, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((err) => err);
      // console.log(confirmInfo)
      // 如果没有点击确认
      if (confirmInfo !== "confirm") return;
      // 如果点击了确认
      // 发起删除请求
      const { data: res } = await this.$http.delete(
        "categories/" + params.cat_id + "/attributes/" + params.attr_id
      );
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，删除参数失败！");
      // 请求成功,弹窗提示
      this.$message.success(res.meta.msg);
      // 重新渲染页面，获取最新的数据
      this.handleClick();
    },
    // 监听文本框按下键盘或者失去焦点后后
    async handleInputConfirm(params) {
      // 判断输入的字符是否合法，空格不合法
      if (params.inputValue.trim().length === 0) {
        // 清空文本框
        params.inputValue = "";
        // 显示按钮
        params.inputVisible = false;
        return;
      }
      // 如果输入的字符合法，则执行下面
      // 将参数添加到 scope.row.attr_vals 上
      if (!params.attr_vals) params.attr_vals += params.inputValue.trim();
      else params.attr_vals += "," + params.inputValue.trim();
      // 调用编辑提交参数接口
      const { data: res } = await this.$http.put(
        "categories/" + params.cat_id + "/attributes/" + params.attr_id,
        {
          attr_name: params.attr_name,
          attr_sel: params.attr_sel,
          attr_vals: params.attr_vals,
        }
      );
      // 如果请求失败
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，添加参数值失败！");
      // 请求成功,弹窗提示
      this.$message.success(res.meta.msg);
      // 不需要重新渲染页面，获取最新的数据，因为已经将最新的数据放在 params.attr_vals 上了 ，数据会自动响应渲染到页面

      // 清空文本框
      params.inputValue = "";
      params.inputVisible = false;
    },
    // 监听文本框失去焦点后
    // handleInputConfirm() {},
    // 点击按钮显示输入框
    showInput(params) {
      // 显示文本框
      params.inputVisible = true;
      // 让文本框自动获取焦点
      // $nextTick 当页面上的元素被重新渲染后，才会去执行回调函数中的内容
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    // 删除参数标签
    async deleteTags(index, params) {
      // 拿到最新的 attr_vals 并对其转成数组，并删除下标为 index 的一项
      let valArray = params.attr_vals.split(",");
      valArray.splice(index, 1);
      // console.log(valArray);
      // 将更新后的数组，以字符串形式传给scope.row
      params.attr_vals = valArray.toString();
      // 发送编辑请求
      const { data: res } = await this.$http.put(
        "categories/" + params.cat_id + "/attributes/" + params.attr_id,
        {
          attr_name: params.attr_name,
          attr_sel: params.attr_sel,
          attr_vals: params.attr_vals,
        }
      );
      // 如果请求失败
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，添加参数值失败！");
      // 请求成功,弹窗提示
      this.$message.success(res.meta.msg);
    },
  },
  //计算属性，能监听this.cateKeys的变化，并作出响应
  computed: {
    isOk() {
      return this.cateKeys.length !== 3;
    },
    titleText() {
      if (this.activeName === "first") return "动态参数";
      else return "静态属性";
    },
  },
};
</script>

<style lang="less" scoped>
// 指定行的上下间距
.rowC {
  margin: 15px 0;
}
// 指定 级联选择器的宽度
.el-cascader {
  width: 300px;
}
// 给标签加间距
.el-tag {
  margin-right: 15px;
}
// new tag的输入框
.input-new-tag {
  width: 90px;
  margin-left: 10px;
  vertical-align: bottom;
}
// new tag标签的按钮
.button-new-tag {
  margin-left: 10px;
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}
</style>
