<!--这是用setup写的，好像这才是vue3该用的，但是有些功能弄不好不知道为啥-->
<template>
    <el-button v-show="chooseAI" class="choose" @click="choose">与AI对话</el-button>
    <div v-show="chooseChat" class="chat">
        <el-icon :size="30" class="back" @click="back"><Back/></el-icon>
        <div class="chatContent" ref="chatBox">
            <ul>
                <li v-for="(item, index) in info" :key="index" :class="[item.is_robot == 0 ? 'left' : 'right']">
                    <span>{{ item.content }}</span>
                </li>
            </ul>
        </div>
        <div class="sendBox">
            <el-input v-model="msg" placeholder="Please input" class="input-with-select">
                <template #append>
                    <el-button @click="sendMsg" type="primary">发送</el-button>
                </template>
            </el-input>
        </div>
    </div>
</template>


<script setup>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import {Back} from "@element-plus/icons-vue";

let chooseAI = false;
let chooseChat = true;
const msg = ref(''); // 输入内容
const info = ref([]); // 修改为数组
function choose(){
    chooseAI = !chooseAI;
    chooseChat = !chooseChat;
    console.log("chooseAI:", chooseAI, "chooseChat:", chooseChat);
}
function back(){
    chooseAI = !chooseAI;
    chooseChat = !chooseChat;
    console.log("chooseAI:", chooseAI, "chooseChat:", chooseChat);
}
// 发送消息
async function sendMsg() {
    if (msg.value.length < 1) {
        ElMessage({ message: '不能发送空消息！', type: 'error', })
        return
    }
    const localMessage = {
        content: msg.value,
        is_robot: 1, // 假设本地消息的 is_robot 为 1
    };
    const answerMessage = {
        content: msg.value,
        is_robot: 0, // 假设本地消息的 is_robot 为 1
    };
    // 将本地消息对象添加到数组中
    info.value.push(localMessage);
    info.value.push(answerMessage);
    // 清空输入框
    msg.value = '';
    // info.value = "已回复";
    // msg.value = '';
    // try {
    //     // const res = await aiChat({ text: msg.value });
    //     info.value.push("ok ok"); // 将新的消息对象添加到数组中
    //     msg.value = ''; // 清空输入框
    // } catch (error) {
    //     console.error('Error:', error.message);
    //     ElMessage({ message: error.message, type: 'error' });
    // }
    // try {
    //     if (msg.value.length < 1) throw new Error('不能发送空消息！');
    //
    //     const res = await aiChat({ text: msg.value });
    //     info.value.push(res.data); // 将新消息添加到数组
    //
    //     msg.value = ''; // 清空输入框
    // } catch (error) {
    //     // console.error('Error:', error.message);
    //     ElMessage({ message: error.message, type: 'error' });
    // }
}
</script>

<style scoped>
.chatContent {
    height: 500px;
    /*width: max-content;*/
    /*right: 0;*/
    /*bottom: 0;*/
    overflow-x: hidden;
}

ul {
    list-style: none;
    padding: 20px;
    margin: 0;
    font-size: 14px;
    line-height: 20px;
}

li.left {
    margin-right: 20px;
}

li.left span {
    display: inline-block;
    border-radius: 0 15px 15px;
    background-color: rgba(66, 196, 240, 0.1);
    padding: 10px 15px;
}

li.right {
    margin-left: 20px;
    text-align: right;
}

li.right span {
    display: inline-block;
    border-radius: 15px 0 15px 15px;
    background-color: rgba(73, 154, 41, 0.1);
    padding: 10px 15px;
}

li+li {
    margin-top: 20px;
}

.ql-container.ql-snow {
    border: 0;
}

.ql-editor {
    padding: 0;
}
.chat{
    background-color: #7f8c8d;
    position: fixed;
    height: 500px;
    width: 300px;
    right: 0;
    top: 300px;
}
.choose{
    background-color: #79bbff;
    position: fixed;
    right: 0;
    top: 800px;
}
.back{
    position: absolute;
    top: 0;
    left: 0;
    /*border: 3px black;*/
    color: white;
    background-color: black;
    opacity: 0.3;
}
</style>
