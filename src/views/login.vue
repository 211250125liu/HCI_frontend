<template>
  <div id="login" :style="{backgroundImage: 'url(' + bgUrl + ')'}">
    <div class="left-side">
        <div id="slogan">
            <h2>足迹相册</h2>
            <h3>留下你的私人旅行回忆</h3>
        </div>
    </div>
    <div id="subForm">
      <div style="text-align: center;color: black;font-weight: bold;font-size: 25px;margin: 35px auto">欢迎登录</div>
        <el-form :model="form" label-width="120px" style="margin-left: 10%" ref="form" :rules="rules">
            <el-form-item label="用户名" prop="username">
                <el-input style="width: 60%" placeholder="请输入账号" v-model="form.username"/>
            </el-form-item>
            <el-form-item label="密码" prop="password">
                <el-input style="width: 60%" placeholder="请输入密码" v-model="form.password" show-password="true"/>
            </el-form-item>
            <el-form-item style="margin-top: 30px;">
                <el-button type="primary" @click="login">登录</el-button>
                <el-button type="success" @click="register">注册</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
import {request} from "../utils/request";

export default {
  name: "login",
    data() {
    return {
        bgUrl: '',
        bgUrlList: [
          './src/assets/bg_chongqing.jpg',
          './src/assets/bg_argentina.jpg',
          './src/assets/bg_haitan.jpg',
          './src/assets/bg_countryside.jpg'
        ],
        bgUrlIndex: 0,
      form: {},
      rules: {
        username: [
          {required: true, message: '请输入用户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 11, message: '长度在 6 到 11 个字符', trigger: 'blur'}
        ],
      },
    }
  },

  mounted() {
    this.bgUrl = './src/assets/bg_chongqing.jpg';
    setInterval(()=>{
          this.bgUrlIndex = (this.bgUrlIndex+1)%this.bgUrlList.length;
          this.bgUrl=this.bgUrlList[this.bgUrlIndex];
          console.log(this.bgUrl)
        },3500
    )
  },
  methods: {
    login() {
        localStorage.setItem("isLogin","true")
        window.location.href = '/TravelHome';
      // this.$refs['form'].validate((valid) => {
      //   if (valid) {
      //     request.post("/user/login", this.form).then(res => {
      //       if (res.code === '0') {
      //         this.$message({
      //           type: "success",
      //           message: "登录成功"
      //         });
      //         localStorage.setItem("isLogin","true")
      //         window.location.href = '/TravelHome';
      //       } else {
      //         this.$message({
      //           type: "error",
      //           message: res.msg
      //         })
      //       }
      //     })
      //   }
      // })
    },
    register() {
      this.$router.push("/register")
    }
  },
}
</script>

<style scoped>
#login {
    display: flex;
    justify-content: space-around;
    align-items: center;
    height: 100vh;
    padding: 0 10%;
    transition: background-image 1s ease-in-out;
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

#subForm {
    width: 400px;
    min-height: 280px;
    background: rgb(255, 255, 255, 1);
    box-sizing: border-box;
    border-radius: 10px;
    box-shadow: 0px 15px 25px rgba(0, 0, 0, 0.5);
    opacity: 0.75;
}

.left-side #subForm{
    flex: 1; /* 每个元素占据一半的空间 */
    display: flex;
    flex-direction: column;
    justify-content: center; /* 确保内容在各自区域内垂直居中 */
    align-items: center; /* 确保内容水平居中 */
}

.left-side{
    margin-bottom: 100px;
}

#slogan {
    color: #ffffff;
    /*color: black;*/
}

#slogan h2 {
    font-size: 100px;
    font-weight: bolder;
    font-family: 黑体;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

#slogan h3 {
    font-size: 40px;
    font-weight: normal;
    font-family: 楷体;
    text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}
</style>
