<template>
    <div>
        <!-- 实现退出功能 -->
        <el-button type="info" @click="logout">         
            退出                        
        </el-button>
    </div>
</template>

<script>
export default {
    methods:{
       logout(){
           //清除浏览器本地中的sessionStorage中的所有信息，包括登陆成功后传递的token
           window.sessionStorage.clear();
           this.$router.push('/login')
       } 
    }
    
}
</script>

<style lang="less" scoped>
    h1{
        width: 100px;
        height: 100px;
        margin: 10px;
        padding: 10px;
        border: 20px solid yellow;
        font-size: 35px;
        box-shadow:0 0 10px yellow;
        border-radius: 50%;
    }
</style>