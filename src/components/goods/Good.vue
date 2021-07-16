<template>
  <div>
    <!-- 顶部面包屑区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <router-view></router-view>
      <!-- 头部搜索和添加按钮区域  -->
      <el-row :gutter="20">
        <el-col :span="6">
          <!-- 搜索文本框 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="clearText">
            <el-button slot="append" icon="el-icon-search" @click="searchGood"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <!-- 添加商品 -->
          <el-button type="primary" @click="showAddPage">添加商品</el-button>
        </el-col>
      </el-row>
      <!-- 商品数据表格区域 -->
      <el-table :data="goodList" border stripe>
        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <!-- 商品名称 -->
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <!-- 商品价格 -->
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
          width="95px"
        ></el-table-column>
        <!-- 商品数量 -->
        <el-table-column
          label="商品重量"
          prop="goods_weight"
          width="95px"
        ></el-table-column>
        <!-- 创建时间 -->
        <el-table-column label="创建时间" width="160px">
          <!-- 使用过滤器显示时间  | 表示启用过滤器，其中 | 前面的为过滤器函数中的第一个参数-->
          <template slot-scope="scope">
            {{ scope.row.add_time | dateFormat }}
          </template>
        </el-table-column>
        <!-- 操作 -->
        <el-table-column label="操作" width="140px">
          <!-- 作用域插槽 -->
          <template slot-scope="scope">
            <!-- 编辑 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="reMoveByid(scope.row.goods_id)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 20, 50]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数
      queryInfo: {
        // 查询参数
        query: "",
        // 页码
        pagenum: 1,
        // 一页显示条数
        pagesize: 10,
      },
      // 商品数据存放地址
      goodList: [],
      // 获取到的数据总条数
      total: 0,
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    //   发起商品数据请求
    async getGoodList() {
      //   发起请求
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo,
      });
      //   console.log(res)
      if (res.meta.status !== 200)
        return this.$message.error("系统错误，获取商品数据失败");
      // 将时间做转换
      // res.data.goods.forEach(item=>{
      //   let date=new Date(item.add_time);
      //   let dateTime=date.toLocaleString();
      //   item.add_time=dateTime
      // })
      // 保存获取到的商品
      this.goodList = res.data.goods;
      // 保存数据总条数
      this.total = res.data.total;
      // console.log(this.goodList)
    },
    // 监听每页显示条数改变
    handleSizeChange(size){
      // 获取改变的条数
      this.queryInfo.pagesize=size;
      // console.log(this.queryInfo.pagesize)
      // 重新发送请求
      this.getGoodList();
    },
    // 监听页码改变
    handleCurrentChange(page){
      // 获取改变的页码
      this.queryInfo.pagenum=page;
      // console.log(this.queryInfo.pagenum)
      // 重新发送请求
      this.getGoodList();
    },
    // 监听查询商品函数
    searchGood(){
      // 发送请求
      this.getGoodList();0
    },
    // 监听搜索文本框被清空的函数
    clearText(){
      // 发送请求
      this.getGoodList();
    },
    // 根据ID删除商品
    async reMoveByid(id){
      // 弹窗提示确认消息
      const confirmInfo=await this.$confirm('此操作将永久删除商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err=>err);
      if(confirmInfo!=='confirm') return;
      // 如果点击确认，则发起删除请求
      const {data:res}=await this.$http.delete('goods/'+id);
      if(res.meta.status!==200) return this.$message.error('系统错误，删除商品失败！');
      this.$message.success('删除成功!');
      // 重新发起请求，获取最新数据
      this.getGoodList()
    },
    // 展示商品添加页面
    showAddPage(){
      this.$router.push('/goods/add');
    }
  },
};
</script>

<style lang="less" scoped>
</style>