<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/goods' }">商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 提示区域 -->
      <el-alert
        title="添加商品信息"
        type="info"
        show-icon
        center
        effect="dark"
        :closable="false"
      ></el-alert>
      <!-- 步骤条区域 -->
      <el-steps
        :space="200"
        :active="activeStepNumber"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <!-- 标签页区域 -->
      <!-- 所有的标签组成了一个表单  表单必须放在最外层-->
      <el-form
        :model="addGoodQuery"
        :rules="addGoodAllRule"
        ref="goodFormRef"
        label-position="top"
        label-width="100px"
      >
        <!-- el-tabs 里面只能放 el-tab-pane  不能放表单  -->
        <!-- :before-leave="beforeTabLeave" 表示了标签切换之前执行的钩子函数，标签一切换就会执行beforeTabLeave 这个钩子 -->
        <el-tabs
          v-model="activeNumber"
          tab-position="left"
          @tab-click="
            activeStepNumber = parseInt(activeNumber);
            tabClicked();
          "
          :before-leave="beforeTabLeave"
        >
          <!-- 基本信息 -->
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addGoodQuery.goods_name"></el-input>
            </el-form-item>
            <!-- type="number" 指定了文本框只能输数字 -->
            <el-form-item label="商品价格" prop="goods_price">
              <el-input
                v-model="addGoodQuery.goods_price"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input
                v-model="addGoodQuery.goods_weight"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input
                v-model="addGoodQuery.goods_number"
                type="number"
              ></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="ids"
                :options="cateList"
                :props="cascaderProps"
                @change="handleChange"
                clearable
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品参数 -->
          <el-tab-pane label="商品参数" name="1">
            <!-- 表单项 -->
            <el-form-item
              v-for="item1 in manyList"
              :key="item1.attr_id"
              :label="item1.attr_name"
            >
              <!-- 复选框  v-model="item1.attr_vals" 绑定的是每个复选框的标题文本，这里直接绑定了所有的attr_vals ，所以默认会勾选上所有的复选框-->
              <el-checkbox-group v-model="item1.attr_vals">
                <!-- 当我们取消勾选某一项复选框时，item1.attr_vals 会一起改变 -->
                <el-checkbox
                  v-for="(item2, i2) in item1.attr_vals"
                  :key="i2"
                  :label="item2"
                  border
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品属性 -->
          <el-tab-pane label="商品属性" name="2">
            <!-- 表单项 -->
            <el-form-item
              v-for="item1 in onlyList"
              :key="item1.attr_id"
              :label="item1.attr_name"
            >
              <el-input v-model="item1.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <!-- 商品图片 -->
          <el-tab-pane label="商品图片" name="3">
            <!-- upload 上传图片 -->

            <!-- action 表示上传图片的地址 必须是后台服务器的地址 -->
            <!-- on-preview 指定图片预览 -->
            <!-- on-remove 指定移除图片 -->
            <!-- list-type="picture" 指定图片呈现方式，这里为列表形式 -->
            <!-- :headers="tokenObj" 用来给upload指定请求头，
            如果不指定请求头，则无法上传图片到服务器中，因为我们只是给axios 设置了token令牌，这里的action并没有用axios发起请求 -->

            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="tokenObj"
              :on-success="getImgPath"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">
            <!-- 富文本编辑器 -->
            <quill-editor v-model="addGoodQuery.goods_introduce">
            </quill-editor>
            <el-button type="primary" class="addGood" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 图片预览对话框 -->
    <el-dialog title="图片预览" :visible.sync="imgDialogVisible" width="50%">
      <img :src="realPath" alt="" />
      <span slot="footer" class="dialog-footer"> </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 保存标签页激活的字符串
      activeNumber: "0",
      // 绑定步骤条的激活数字
      activeStepNumber: 0,
      // 添加商品的所有请求参数
      addGoodQuery: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: "",
        attrs: [],
        pics: [],
        goods_introduce: "",
      },
      // 所有标签页的规则
      addGoodAllRule: {
        // 商品名称规则
        goods_name: [
          { required: true, message: "请输入商品名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        // 商品价格规则
        goods_price: [
          { required: true, message: "请输入商品价格", trigger: "blur" },
        ],
        // 商品重量规则
        goods_weight: [
          { required: true, message: "请输入商品重量", trigger: "blur" },
        ],
        // 商品数量规则
        goods_number: [
          { required: true, message: "请输入商品数量", trigger: "blur" },
        ],
        // 商品分类规则
        goods_cat: [
          { required: true, message: "请输入商品分类", trigger: "blur" },
        ],
      },
      //级联选择器的匹配规则
      cascaderProps: {
        expandTrigger: "hover",
        value: "cat_id",
        label: "cat_name",
        children: "children",
      },
      //   级联选择器绑定的值，每选择节点都会概念该ids的值，数组中有三个元素
      ids: [],
      //   商品分类数据存放地址
      cateList: [],
      // 商品动态参数数据存放地址
      manyList: [],
      // 商品静态属性数据存放地址
      onlyList: [],
      // upload 的请求头，包含了token令牌
      tokenObj: { Authorization: window.sessionStorage.getItem("token") },
      // 图片预览的真实路径
      realPath: "",
      // 控制图片预览对话框的属性
      imgDialogVisible: false,
    };
  },
  created() {
    this.getCate();
  },
  methods: {
    //   获取商品分类
    async getCate() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取商品分类信息失败！");
      this.cateList = res.data;
    },
    //   级联选择器改变
    handleChange() {
      // console.log(this.ids)
      // 如果数组长度小于3，则清空ids 并返回
      if (this.ids.length !== 3) {
        this.ids = [];
        return;
      }
      // 如果数组长度等于3，则将ids的值转为字符串赋给请求参数中的 goods_cat
      this.addGoodQuery.goods_cat = this.ids.toString();
      // console.log(this.addGoodQuery.goods_cat);
    },
    // 监听标签页切换的钩子函数
    // activeName 为切换后的 name属性 ，  oldActiveName 为切换前的属性
    beforeTabLeave(activeName, oldActiveName) {
      // 判断切换前的标签页是否为第一页
      if (oldActiveName === "0") {
        //   判断是否选择的是三级标签
        if (this.ids.length !== 3) {
          this.$message.error("请选择商品分类！");
          //   返回false会阻止标签页的切换
          return false;
        }
      }
    },
    // 监听标签页点击事件
    async tabClicked() {
      // 判断标签页是否是商品参数，如果是则发起请求
      if (this.activeNumber === "1") {
        // 发起获取动态参数请求
        const { data: res } = await this.$http.get(
          "categories/" + this.ids[2] + "/attributes",
          { params: { sel: "many" } }
        );
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("系统错误，获取参数信息失败！");
        // 对每个 attr_vals 做处理，从字符串改为数组
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(",");
        });
        this.manyList = res.data;
        // console.log(this.manyList)
      }

      // 判断标签页是否是商品属性，如果是则发起请求
      if (this.activeNumber === "2") {
        // 发起获取静态属性请求
        const { data: res } = await this.$http.get(
          "categories/" + this.ids[2] + "/attributes",
          { params: { sel: "only" } }
        );
        // console.log(res);
        if (res.meta.status !== 200)
          return this.$message.error("系统错误，获取属性信息失败！");
        this.onlyList = res.data;
      }
    },
    // 处理图片预览
    handlePreview(file) {
      // 获取图片的真实路径
      this.realPath = file.response.data.url;
      // 让图片预览对话框可见
      this.imgDialogVisible = true;
    },
    // 处理移除图片
    handleRemove(file) {
      // 拿到被删除图片的临时路径
      const imgPathDelete = file.response.data.tmp_path;
      // 定义一个变量，表示被删除图片的下标
      let index = 0;
      // 遍历图片路径数组
      this.addGoodQuery.pics.forEach((item) => {
        // 如果路径等于响应的路径，则index++
        if (item.pic !== imgPathDelete) {
          index++;
        }
        // 如果等于，则终止循环
        else return;
      });
      // 将我们移除图片的路径，从 addGoodQuery.pics 数组中删除
      this.addGoodQuery.pics.splice(index, 1);
      // console.log(this.addGoodQuery);
    },
    // 获取图片临时路径
    getImgPath(response) {
      // 向全局请求参数 addGoodQuery 的 图片请求参数数组 里面push一个对象
      this.addGoodQuery.pics.push({ pic: response.data.tmp_path });
      // console.log(this.addGoodQuery)
    },
    add() {
      // console.log(this.addGoodQuery.goods_introduce)
      // 对表单进行预验证
      this.$refs.goodFormRef.validate(async (valid) => {
        if (!valid)
          return this.$message.error("您的基本信息还未完善，请填写相关信息！");
        //将manyList 和onlyList 上 的attr_vals  属性转为数组
        this.manyList.forEach((item) => {
          item.attr_vals = item.attr_vals.join(",");
          // 将id和值转为一个对象并push到参数数组中去
          this.addGoodQuery.attrs.push({ 'attr_id':item.attr_id,'attr_value':item.attr_vals});
        });
        // 对onlyList做处理
        this.onlyList.forEach((item) => {
          // 将id和值转为一个对象并push到参数数组中去
          this.addGoodQuery.attrs.push({ 'attr_id':item.attr_id,'attr_value':item.attr_vals});
        });
        // console.log(this.manyList,this.onlyList);
        // console.log(this.addGoodQuery);
        // 发起添加商品请求
        const {data:res}=await this.$http.post('goods',this.addGoodQuery);
        // console.log(res);
        if(res.meta.status!==201) return this.$message.error('系统错误，添加商品失败！');
        this.$message.success('添加成功！');
        // 跳转到商品列表页
        this.$router.push('/goods');

      });
    },
  },
};
</script>

<style lang="less" scoped>
// 设置步骤条的上下间距
.el-steps {
  margin: 15px 0px;
}
// 设置级联选择器的宽度
.el-cascader {
  width: 300px;
}
// 设置复选框的间距
.el-checkbox {
  margin: 0px 15px 0px 0px !important;
}
// 设置图片的宽度
img {
  width: 100%;
}
// 设置添加商品按钮的样式
.addGood {
  margin-top: 15px;
}
</style>