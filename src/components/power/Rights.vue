<template>
  <div>
      <!-- 头部导航栏区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="box-card"> 
        <!-- 权限数据表格区域 -->
        <el-table :data="rightsDataList" border stripe>
            <el-table-column type="index" label="#"></el-table-column>
            <el-table-column label="权限名称" prop="authName"></el-table-column>
            <el-table-column label="路径" prop="path"></el-table-column>
            <el-table-column label="权限等级" prop="level">
                <!-- 通过作用域插槽 -->
                <template slot-scope="scope">
                    <!-- 通过三个V-IF 来控制 下面三个tag标签显示哪一个 -->
                    <el-tag v-if="scope.row.level==='0'">一级</el-tag>
                    <el-tag v-if="scope.row.level==='1'" type="success">二级</el-tag>
                    <el-tag v-if="scope.row.level==='2'" type="warning">三级</el-tag>
                </template>
            </el-table-column>        
        </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
    data(){
        return{
            // 权限列表数据
            rightsDataList:[],

        }
    },
    created(){
        // 组件一加载就执行下面的函数
        this.getRightsList()
    },
    methods:{
        // 获取权限列表数据
        async getRightsList(){
            const {data:res}=await this.$http.get('rights/list');
            if(res.meta.status!==200) return this.$message.error('系统错误，获取权限信息失败！');
            this.rightsDataList=res.data;
        }
    },
};
</script>
<style lang="less" scoped>
</style>