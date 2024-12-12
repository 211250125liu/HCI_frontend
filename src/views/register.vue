<template>
  <div id="login" :style="{backgroundImage: 'url(' + bgUrl + ')'}">
    <div class="left-side">
        <div id="slogan">
            <h2>足迹相册</h2>
            <h3>留下你的私人旅行回忆</h3>
        </div>
    </div>
    <div id="subForm" >
      <div style="text-align: center;color: black;font-weight: bold;font-size: 25px;margin: 35px auto">注册账号</div>
      <el-form :model="form" label-width="120px" style="margin-left: 10%" ref="form" :rules="rules">
        <el-form-item label="账号" prop="username">
          <el-input style="width: 70%" placeholder="请输入用户名" v-model="form.username" />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input style="width: 70%" placeholder="请输入密码" v-model="form.password" show-password="true" />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirm">
          <el-input style="width: 70%" v-model="form.confirm" show-password placeholder="请再次输入密码"></el-input>
        </el-form-item>
        <el-form-item style="margin-top: 20px;">
          <el-button type="primary" @click="back">返回</el-button>
          <el-button type="success" @click="register">点击注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>

import {request} from "../utils/request";

export default {
  name: "register",
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
      form : {},
      rules: {
        username: [
          {required:true,message:'请输入用户名',trigger:'blur'},
          // {min: 2, max: 11, message: '长度在 3 到 5 个字符', trigger: 'blur'}
        ],
        password: [
          {required:true,message:'请输入密码',trigger:'blur'},
          {min: 6, max: 32, message: '长度在 6 到 32 个字符', trigger: 'blur'}
        ],
        confirm: [
          {required:true,message:'请再次输入密码',trigger:'blur'}
        ],
      }
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
  methods:{
    register() {
      if (this.form.password !== this.form.confirm){
        this.$message({
          type: "error",
          message: "两次输入密码不一致"
        })
        return
      }
      this.$refs['form'].validate((valid) => {
        if (valid) {
          request.post("/user/register",this.form).then(res => {
            if (res.code === '0') {

              this.$message({
                type: "success",
                message: "注册成功"
              })
              this.$router.push("/login")   //登录成功后进行页面的跳转
            }else {

              this.$message({
                type: "success",
                message: res.msg
              })

            }
          })
        }else {
          this.$message({
            type: "error",
            message: "请将信息输入完毕"
          })
        }
      })
    },
    back() {
        this.$router.push("/login")
    }
  }
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
    font-weight: bold;
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
