<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加分类 -->
      <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
      <!-- 商品分类表格 -->
      <!-- :data 绑定数据源，:columns="columns" 给列绑定匹配规则， :selection-type 定义行的选中，  :expand-type 定义行能否展开 ，
        ，show-index 定义排序列，index-text 定义序号的表头显示-->
      <!-- 给属性赋布尔类型的值必须被绑定，赋其他类型的值不需要v-bind -->
      <tree-table
        :data="categorieList"
        :columns="columns"
        :selection-type="false"
        :expand-type="false"
        show-index
        index-text="#"
        border
        class="treetable"
      >
        <!-- 自定义的模板，和columns里面的isok相对应，相当于具名插槽 -->
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <!-- 有效状态图标 -->
          <i
            v-if="!scope.row.cat_deleted"
            class="el-icon-success"
            style="color: lightgreen"
          ></i>
          <!-- 无效状态图标 -->
          <i
            v-if="scope.row.cat_deleted"
            class="el-icon-error"
            style="color: red"
          ></i>
        </template>

        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <!-- 一级图标 -->
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <!-- 二级图标 -->
          <el-tag type="success" v-if="scope.row.cat_level === 1">二级</el-tag>
          <!-- 三级图标 -->
          <el-tag type="warning" v-if="scope.row.cat_level === 2">三级</el-tag>
        </template>

        <!-- 操作 -->
        <template slot="option" slot-scope="scope">
          <!-- 编辑按钮 -->
          <el-button type="primary" icon="el-icon-edit" size="mini"
            >编辑</el-button
          >
          <!-- 删除按钮 -->
          <el-button type="danger" icon="el-icon-delete" size="mini"
            >删除</el-button
          >
        </template>
      </tree-table>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="cateInfo.pagenum"
        :page-sizes="[2, 5, 10, 50]"
        :page-size="cateInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
    <!-- 添加用户对话框 -->
    <!-- @close="addCateDialogClose"  对话框被关闭时，应执行方法 -->
    <el-dialog
      title="添加分类"
      :visible.sync="addCateDialogVisible"
      width="50%"
      @close="addCateDialogClose"
    >
      <div>
        <!-- 添加分类表单 -->
        <el-form
          :model="addCateInfo"
          :rules="addCateRules"
          ref="addCateFormRef"
          label-width="100px"
        >
          <!-- 分类名称 -->
          <!-- prop 是ITEM的属性，不能用在 el-input 上  -->
          <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="addCateInfo.cat_name" placeholder="请输入分类名称"></el-input>
          </el-form-item>
          <el-form-item label="父级分类：">
            <!-- 父级分类下拉框 -->
            <!-- options 指定数据源  -->
            <!-- props 指定级联选择器的匹配规则  -->
            <!-- v-model 必须绑定一个数组 -->
            <!-- @change 当选中节点变化时触发  回调参数为：选中节点的值 -->
            <!-- clearable 下拉框可以被清空 -->
            <el-cascader
              v-model="cateKeys"
              :options="parentCateList"
              :props="cascaderProps"
              @change="parentCateChange"
              clearable
              ref="cascaderRef"
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCate"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // 数据
  data() {
    return {
      // 发送商品分类请求的参数，是一个对象
      // type 指定获取几级分类
      // pagenum 指定当前页码
      // pagesize 指定一页显示多少条数据
      cateInfo: {
        type: 3,
        pagenum: 1,
        pagesize: 5,
      },
      // 商品分类数据存放地址
      categorieList: [],
      //商品分类数据的总条数
      total: 0,
      // 为tree-teble 指定列的匹配规则，是一个数组
      columns: [
        //   分类名
        {
          // label是名称
          label: "分类名称",
          //   prop是匹配的真实数据的列名
          prop: "cat_name",
        },

        // 是否有效
        {
          label: "是否有效",
          //   prop: "cat_deleted",
          // 将当前列定义为自定义模板列
          type: "template",
          // 表示当前列的模板名字，相当于具名插槽的name
          template: "isok",
        },

        // 排序
        {
          label: "排序",
          // 将当前列定义为自定义模板列
          type: "template",
          // 表示当前列的模板名字，相当于具名插槽的name
          template: "order",
        },

        // 操作
        {
          label: "操作",
          // 将当前列定义为自定义模板列
          type: "template",
          // 表示当前列的模板名字，相当于具名插槽的name
          template: "option",
        },
      ],
      // 监听用户对话框
      addCateDialogVisible: false,
      // 双向绑定的添加分类参数
      addCateInfo: {
        // 分类名
        cat_name: "",
        // 父类ID
        cat_pid: 0,
        // 分类等级
        cat_level: 0,
      },
      // 给添加分类增加校验规则
      addCateRules: {
        // 分类名称的校验规则
        cat_name: [
          { required: true, message: "请输入分类名称", trigger: "blur" },
          {
            min: 2,
            max: 10,
            message: "长度在 2 到 10 个字符",
            trigger: "blur",
          },
        ],
      },
      // 父级分类的保存地址
      parentCateList:[],
      // 级联选择器的匹配规则
      cascaderProps:{
         expandTrigger: 'hover' ,label:'cat_name',value:'cat_id',children:'children',checkStrictly: true
      },
      // 选中项的ID存放地址
      cateKeys:[]
    };
  },
  // 生命周期函数
  created() {
    this.getCategorieList();
  },
  methods: {
    async getCategorieList() {
      // 发送获取商品分类数据请求
      const { data: res } = await this.$http.get("categories", {
        params: this.cateInfo,
      });
      // 如果获取数据失败，则return
      //   console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取商品分类信息失败！");
      // 保存获取到商品数据
      this.categorieList = res.data.result;
      //   console.log(this.categorieList);
      // 保存获取到的商品数据的总条数
      this.total = res.data.total;
    },
    // 一页显示条数改变时触发下面函数
    handleSizeChange(size) {
      // console.log(size);
      this.cateInfo.pagesize = size;
      this.getCategorieList();
    },
    // 当前页改变时触发
    handleCurrentChange(page) {
      // console.log(page);
      this.cateInfo.pagenum = page;
      this.getCategorieList();
    },
    // 监听展示添加分类对话框
    showAddCateDialog() {
      // 展示对话框之前先获取父级分类数据
      this.getParentCateList();
      this.addCateDialogVisible = true;
    },
    // 获取父级分类
    async getParentCateList(){
      // 获取父级分类
      const { data: res } = await this.$http.get("categories", {params:{type:2}});
      // 如果请求失败
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取商品分类信息失败！");
      // 如果请求成功
      // console.log(res.data)
      // 保存父级分类
      this.parentCateList=res.data;
    },
    // 当节点值改变时，执行函数
    parentCateChange(){
      // 点击折叠项，级联选择器被收起
      this.$refs.cascaderRef.dropDownVisible=false;
      if(this.cateKeys.length===0){
        this.addCateInfo.cat_pid=0;
        this.addCateInfo.cat_level=0
      };
      if(this.cateKeys.length===1){
        this.addCateInfo.cat_pid=this.cateKeys[0];
        this.addCateInfo.cat_level=1
      };
      if(this.cateKeys.length===2){
        this.addCateInfo.cat_pid=this.cateKeys[1];
        this.addCateInfo.cat_level=2
      };
      console.log(this.addCateInfo.cat_pid,this.addCateInfo.cat_level)
    },
    // 监听对话框关闭函数
    async addCateDialogClose(){
      // 将表单重置为初始状态
      this.$refs.addCateFormRef.resetFields();
      // 初始化级联选择器双向绑定的cateKeys
      this.cateKeys=[];
      // 将请求参数初始化
      this.addCateInfo={ cat_name: "",cat_pid: 0,cat_level: 0};
    },
    // 添加分类请求
    addCate(){
      this.$refs.addCateFormRef.validate(async valid=>{
        // 如果校验失败，则返回
        if(!valid) return;
        // 校验成功
        const {data:res}=await this.$http.post('categories',this.addCateInfo);
        if(res.meta.status!==201) return this.$message.error('系统错误，添加分类失败！');
        this.$message.success(res.meta.msg);
        // 重新渲染页面，获取最新的数据 
        this.getCategorieList();
        // 隐藏对话框
        this.addCateDialogVisible=false;
      })
    }
  },
};
</script>

<style lang="less" scoped>
.treetable {
  margin: 15px;
}
</style>