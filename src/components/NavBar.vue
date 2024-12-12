<template>
    <el-menu :default-active="activeMenu" class="el-menu" mode="horizontal" @select="handleMenuSelect" router>
        <div class="logo-container">
            <img src="/image/logo2.png" alt="Logo" class="logo" />
            <span class="project-name">足迹相册</span>
        </div>
        <el-menu-item index="/TravelHome">首页</el-menu-item>
        <el-menu-item index="/settings" v-if="isLogin">个人中心</el-menu-item>
        <el-menu-item index="/login" @click.native="refreshPage">{{ isLogin ? '登出' : '登陆/注册' }}</el-menu-item>
    </el-menu>
</template>

<script>

export default {
    name: "NavBar",
    created() {
        this.isLogin = localStorage.getItem("isLogin") === "true";
        this.activeMenu = this.isLogin ? '/TravelHome' : '/login';
    },
    data() {
        return {
            isLogin: false,
            activeMenu: '/login'
        }
    },
    methods: {
        refreshPage(){
            // window.location.reload();
            // setTimeout(() => {
            //     window.location.reload();
            // }, 300);
            // router.push("/login")
        },
        handleMenuSelect(index) {
            if (index === '/login' && localStorage.getItem("isLogin") === "true") {
                this.isLogin = false;
                localStorage.setItem("isLogin", "false")
                // window.location.reload();
            }
        },
    }
}
</script>

<style scoped>
.logo-container {
    display: flex;
    align-items: center;
    margin-right: 20px;
    /* 在 logo 和菜单项之间添加一些空间 */
}

.logo {
    height: 60px;
    /* 根据需要调整 logo 的大小 */
}

.project-name {
    margin-left: 10px;
    font-weight: bold;
    font-size: large;
}
</style>
