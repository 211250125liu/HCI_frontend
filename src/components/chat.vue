<template>
    <el-button v-show="chooseAI" class="choose" @click="choose">
        <span class="online-indicator"></span>AI旅行顾问
    </el-button>
    <transition enter-active-class="animate-slide-in" leave-active-class="animate-slide-out">
        <div v-show="chooseChat" class="chat">
            <el-icon :size="15" class="back" @click="choose">
                <Close />
            </el-icon>
            <el-icon :size="15" class="resetButton" @click="reset">
                <Refresh />
            </el-icon>
            <div class="chatContent" ref="chatBox">
                <ul>
                    <li v-for="(item, index) in info" :key="index" :class="[index % 2 === 1 ? 'left' : 'right']">
                        <span>{{ item }}</span>
                    </li>
                </ul>
            </div>
            <div class="sendBox">
                <el-input v-model="msg" placeholder="输入信息…" class="input-with-select" @keyup.enter="sendMsg">
                    <template #append>
                        <el-button @click="sendMsg" type="primary">发送</el-button>
                    </template>
                </el-input>
            </div>
        </div>
    </transition>
</template>


<script>
import { ref } from 'vue';
import { ElMessage } from 'element-plus';
import { Back, Close, Refresh } from "@element-plus/icons-vue";
import axios from 'axios';

export default {
    components: { Close, Back, Refresh },
    watch: {
        info: {
            deep: true,
            handler() {
                // 使用 $nextTick 来确保在 DOM 更新后执行滚动到底部的操作
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
            },
        },
    },
    // mounted() {
    //      if(localStorage.getItem("isLogin") === "true"){
    //          this.chooseAI = true;
    //      }
    //  },
    data() {
        return {
            chooseAI: true,
            chooseChat: false,
            msg: ref(''),
            info: ref([]),
            localMessage: {
                content: [],
                is_robot: 1,
            },
            answerMessage: {
                content: [],
                is_robot: 0,
            }
        }
    },
    methods: {
        reset() {
            this.info = []
            this.localMessage.content = []
            this.answerMessage.content = []
            this.msg = ''
        },
        scrollToBottom() {
            // 在新消息添加时自动滚动到底部
            const chatBox = this.$refs.chatBox;
            chatBox.scrollTop = chatBox.scrollHeight;
        },
        choose() {
            this.chooseAI = !this.chooseAI;
            this.chooseChat = !this.chooseChat;
            console.log("chooseAI:", this.chooseAI, "chooseChat:", this.chooseChat);
        },
        sendMsg() {
            if (this.msg.length < 1) {
                ElMessage({ message: '不能发送空消息！', type: 'error', })
                return
            }
            // 将本地消息对象添加到数组中
            this.info.push(this.msg);
            this.localMessage.content.push(this.msg)

            console.log("lcoal", this.localMessage)
            // 构建请求参数
            const requestData = {
                model: "qwen-max-1201",
                input: { messages: [] }
            };

            for (let i = 0; i < this.localMessage.content.length || i < this.answerMessage.content.length; i++) {
                if (i < this.localMessage.content.length) {
                    requestData.input.messages.push({
                        role: 'user',
                        content: this.localMessage.content[i],
                    });
                }
                if (i < this.answerMessage.content.length) {
                    requestData.input.messages.push({
                        role: 'assistant',
                        content: this.answerMessage.content[i],
                    });
                }
            }

            console.log("post", requestData)

            // 使用axios发送POST请求
            axios.post('/ai/api/v1/services/aigc/text-generation/generation', requestData)
                .then(response => {
                    // 处理大模型返回的数据
                    const modelResponse = response.data.output.text;

                    // 将大模型的返回添加到answerMessage中
                    this.answerMessage.content.push(modelResponse);

                    console.log("answer", this.answerMessage)

                    // 将answerMessage添加到数组中
                    this.info.push(modelResponse);
                })
                .catch(error => {
                    this.$message({
                        type: "error",
                        message: "大模型已挂"
                    });
                })
            this.msg = '';
            console.log("info", this.info)
        }
    }
}
</script>

<style scoped>
/*@keyframes expandAnimation {*/
/*    from {*/
/*        opacity: 0;*/
/*        transform: scale(0.5);*/
/*    }*/
/*    to {*/
/*        opacity: 1;*/
/*        transform: scale(1);*/
/*    }*/
/*}*/

@keyframes slide-in {
    from {
        opacity: 0;
        transform: scale(0.5);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}

@keyframes slide-out {
    from {
        opacity: 1;
        transform: scale(1);
    }

    to {
        opacity: 0;
        transform: scale(0.5);
    }
}


.chatContent {
    height: 570px;
    overflow-x: hidden;
    margin-top: 15px;
}

.chatContent::-webkit-scrollbar {
    width: 10px;
    /* 设置滚动条的宽度 */
}

.chatContent::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.1);
    /* 设置滚动条滑块的背景色，这里是淡化的黑色 */
    border-radius: 6px;
    /* 设置滚动条滑块的圆角 */
}

.chatContent::-webkit-scrollbar-track {
    background-color: transparent;
    /* 设置滚动条轨道的背景色，这里是透明的 */
}

/* 悬停在滚动条上时，显示的样式 */
.chatContent::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.4);
    /* 悬停时淡化滑块颜色 */
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

.chat {
    background-color: #ffffff;
    position: fixed;
    height: 600px;
    bottom: 20px;
    width: 400px;
    right: 20px;
    /*box-shadow: 0 0 30px rgba(0, 0, 0, 0.1);*/
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19);
    transform-origin: right bottom;
    /* 设置变换原点为左下角 */
}

.choose {
    background-color: #f5fffa4D;
    position: fixed;
    width: 120px;
    height: 40px;
    padding: 10px 15px;
    font-size: 16px;
    right: 20px;
    bottom: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2), 0 6px 20px rgba(0, 0, 0, 0.19);
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.online-indicator {
    display: inline-block;
    width: 8px;
    height: 8px;
    background-color: #2bc4ea;
    box-shadow: 0 0 4px rgba(0, 0, 0, 0.25);
    border-radius: 50%;
    margin-right: 5px;
}


.back {
    position: absolute;
    top: 20px;
    right: 20px;
    color: #000000;
    /*padding: 10px; !* 增加内边距以扩大点击区域 *!*/
    cursor: pointer;
    /* 改变鼠标指针样式为手形，提示可点击 */
}

.sendBox {
    position: absolute;
    bottom: 0;
    right: 0;
    height: 30px;
}

.input-with-select {
    width: 400px;
    left: 0;
}

.resetButton {
    position: absolute;
    top: 20px;
    left: 20px;
    color: #000000;
    cursor: pointer;
}

.animate-slide-in {
    animation: slide-in 0.4s ease-out forwards;
}

.animate-slide-out {
    animation: slide-out 0.4s ease-out forwards;
}
</style>
