<template>
<!--    行-->
    <el-row class="tac">
        <el-col :span="3">
            <el-menu
                    default-active="1"
                    class="el-menu-vertical-demo"
            >
                <el-menu-item index="1" @click="activeIndex='1'">
                    <el-icon><User /></el-icon>
                    <span>我的信息</span>
                </el-menu-item>
                <el-menu-item index="2" @click="activeIndex='2'">
                    <el-icon><Camera /></el-icon>
                    <span>我的头像</span>
                </el-menu-item>
                <el-menu-item index="3" @click="activeIndex='3'">
                    <el-icon><setting /></el-icon>
                    <span>绑定设置</span>
                </el-menu-item>
                <el-menu-item index="4" @click="activeIndex='4'">
                    <el-icon><Lock /></el-icon>
                    <span>账号安全</span>
                </el-menu-item>
                <el-menu-item index="5" @click="activeIndex='5'">
                    <el-icon><FolderDelete /></el-icon>
                    <span>注销账号</span>
                </el-menu-item>
            </el-menu>
        </el-col>

<!--         根据选择的菜单项显示内容 -->
        <el-col :span="16">
            <div v-if="activeIndex === '1'" class="my-info">
                <div style="display: flex">
                    <div class="infoText">
                        我的信息
                    </div>
                    <div class="demo-progress">
                        <el-progress :percentage="33" />
                    </div>
                </div>
                <el-divider style="width: 800px"/>
                <el-form label-position="right" label-width="100px">
                    <el-form-item label="用户名：">
                        <el-input v-model="name" placeholder="请输入用户名" style="width: 220px"></el-input>
                    </el-form-item>
                    <el-form-item label="性别：">
                        <el-radio-group v-model="userInfo.gender">
                            <el-radio label="男">男</el-radio>
                            <el-radio label="女">女</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="居住地：">
                        <el-input v-model="userInfo.location" placeholder="请输入居住地" style="width: 220px"></el-input>
                    </el-form-item>
                    <el-form-item label="出生日期：">
                        <div class="block" >
                            <el-date-picker
                                v-model="value1"
                                type="date"
                                placeholder="请选择生日"
                                size='default'
                            />
                        </div>
                    </el-form-item>
                    <el-form-item label="个人简介：">
                        <el-input
                            class="bio-textarea"
                            type="textarea"
                            v-model="userInfo.bio"
                            placeholder="请输入个人简介"
                            rows="4"
                        ></el-input>
                    </el-form-item>
                    <!-- 添加其他表单项 -->
                    <el-form-item>
                        <el-button type="primary">保存</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <div v-if="activeIndex === '2'" class="my-avatar">
                <div style="display: flex">
                    <div class="infoText">
                        我的头像
                    </div>
                    <div class="explain">
                        挑选随机生成的图片
                    </div>
                </div>

                <el-divider style="width: 800px"/>
                <div class="avatar-preview" style="margin-bottom: 20px;">
                    <img :src="avatarUrl" alt="头像预览" class="avatar">
                </div>
                <div>
                    <el-button type="default" @click="generateRandomAvatar">刷新头像</el-button>
                    <el-button type="primary" @click="saveAvatar">保存图片</el-button>
                </div>
            </div>
            <div v-if="activeIndex === '3'">我的设置</div>
            <div v-if="activeIndex === '4'">我的安全</div>
            <div v-if="activeIndex === '5'">注销账号</div>
        </el-col>
    </el-row>
</template>

<script lang="ts" setup>
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting, User, Camera, Lock, FolderDelete,
} from '@element-plus/icons-vue'
import {onMounted, ref, watch} from "vue";
import {request} from "../utils/request.js";


const activeIndex = ref('1');
const userInfo = ref({
    name: '',
    gender: '男',
    location: '',
    bio: '',
})
watch(activeIndex, (newValue) => {
    console.log('当前激活的菜单项：', newValue);
});
const avatarUrl = ref(`https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/150`);
const generateRandomAvatar = () => {
    avatarUrl.value = `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/150`;
};
const saveAvatar = () => {
    // localStorage.setItem('savedAvatarUrl', avatarUrl.value);
};
// 日期选择器
const size = ref('default');
const value1 = ref('');
const name = ref('');

onMounted(() => {
    // Make the API request here
    request.get('/user/info')
        .then(res => {
            console.log("res "+ res.result)
            name.value = res.result
            console.log(name.value)
        })
        .catch(error => {
            console.error('Error:', error);
        });
});

</script>

<style scoped>
.tac{
    display: flex;           /* 启用 Flexbox 布局 */
    left: 25%;
    top: 50px;
}
.el-menu-vertical-demo {
    border: none; /* 如果需要，去除菜单的边框 */
}
/*menu item*/
.el-menu-item {
    margin: 5px 0; /* Add spacing between items (adjust as needed) */
}
.el-menu-item.is-active {
    /*here！！！！！*/
    background-color: #e6f7ff; /* Change background color when selected */
}

/*1 信息*/
.my-info {
    margin-left: 30px;
    background-color: #fff;
    /*padding: 20px;*/
}
.bio-textarea {
    width: 60%;  /* Example: making the textarea take the full container width */
    /* Add other styles as needed */
}
.infoText{
    font-size: 25px;
}
.demo-progress .el-progress--line {
    left: 10px;
    top: 15px;
    width: 150px;
}
/*2 头像*/
.my-avatar {
    text-align: left;
    margin-left: 30px;
}
.avatar-preview {
    display: inline-block;
    width: 150px;
    height: 150px;
    border: 1px solid #d9d9d9;
    border-radius: 6px;
    margin-bottom: 10px;
    background-color: #fafafa;
    line-height: 150px;
    overflow: hidden;
}
.avatar {
    max-width: 100%;
    max-height: 100%;
    /*vertical-align: middle;*/
    object-fit: cover;
    vertical-align: top;
}
.explain{
    margin-left: 10px;
    margin-top: 10px;
    color: rgba(0, 0, 0, 0.5);
}
</style>
