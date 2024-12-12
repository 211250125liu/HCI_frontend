<template>
  <div>
    <label for="myInput">新景点名称：</label>
    <input
        id="myInput"
        v-model="inputValue"
        type="text"
        placeholder="在这里输入"
    />
  </div>
  <div style="border: 1px solid #ccc">
    <Toolbar
        style="border-bottom: 1px solid #ccc"
        :editor="editorRef"
        :defaultConfig="toolbarConfig"
        :mode="mode"
    />
    <Editor
        style="height: 500px; overflow-y: hidden;"
        v-model="valueHtml"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="handleCreated"
    />
  </div>
  <div class="add-footprint-btn">
    <button class="button" @click="saveToFile">添加足迹</button>
  </div>
</template>

<script>
import '@wangeditor/editor/dist/css/style.css' // 引入 css
import {h, onBeforeUnmount, ref, shallowRef} from 'vue'
import {Editor, Toolbar} from '@wangeditor/editor-for-vue'
import {request} from "../utils/request";
import {ElNotification} from "element-plus";

// Function to upload an image
export const uploadImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('image', imageFile);  // Assuming the image is passed as a file
    // Make a POST request to the '/image/upload' endpoint (adjust the endpoint accordingly)
    const response = await request.post('/image/upload', formData);
    // Parse the returned URL from the response
    const imageUrl = response.data.url;  // Adjust the key based on the actual response structure

    return imageUrl;
  } catch (error) {
    this.$message({
      type: "error",
      message: "上传图片失败"
    });
    console.error('Error uploading image:', error);
    throw error;
  }
};

// 自定义校验图片
function customCheckImageFn(src, alt, url) {
  return true
}

// 转换图片链接
function customParseImageSrc(src) {
  return `http://localhost:8081/image/${src}`
}


export default {
  components: {Editor, Toolbar},
  created() {
    let content = sessionStorage.getItem("content")
    if (content !== '') {
      this.valueHtml = content
    } else if (content === '') {
      ElNotification({
        title: '保存失败',
        message: h('i', {style: 'color: teal'}, '请输入内容'),
      })
    }
    let title = sessionStorage.getItem("title")
    if (title !== '') {
      this.inputValue = title;
    } else if (title === '') {
      ElNotification({
        title: '保存失败',
        message: h('i', {style: 'color: teal'}, '标题为空'),
      })
    }
  },
  setup() {
    // 编辑器实例，必须用 shallowRef
    const editorRef = shallowRef()

    // 内容 HTML
    const valueHtml = ref('<p></p>')

    // 模拟 ajax 异步获取内容
    // onMounted(() => {
    //   setTimeout(() => {
    //     valueHtml.value = '<p>我的新足迹</p>'
    //   }, 1500)
    // })

    const toolbarConfig = {}
    const editorConfig = {placeholder: '我的新足迹...', MENU_CONF: {}}

    editorConfig.MENU_CONF['uploadImage'] = {

      maxFileSize: 10 * 1024 * 1024,

      server: '/image',

      async customUpload(file, insertFn) {                   // JS 语法

        // 自定义上传
        uploadImage(file).then((imageUrl) => {
          console.log('Image uploaded successfully. URL:', imageUrl);
          insertFn(imageUrl, '', imageUrl)
        }).catch((error) => {
          this.$message({
            type: "error",
            message: "上传图片失败"
          });
          console.error('Failed to upload image:', error);
        });
      },
    }

    editorConfig.MENU_CONF['insertImage'] = {
      server: '/image',
      onInsertedImage(imageNode) {                    // JS 语法
        if (imageNode == null) return

        const {src, alt, url, href} = imageNode
        console.log('inserted image', src, alt, url, href)
      },
      checkImage: customCheckImageFn, // 也支持 async 函数
      parseImageSrc: customParseImageSrc, // 也支持 async 函数
    }

    editorConfig.MENU_CONF['editImage'] = {
      server: '/image',
      onUpdatedImage(imageNode) {                    // JS 语法
        if (imageNode == null) return

        const {src, alt, url} = imageNode
        console.log('updated image', src, alt, url)
      },
      checkImage: customCheckImageFn, // 也支持 async 函数
      parseImageSrc: customParseImageSrc, // 也支持 async 函数
    }

    // 组件销毁时，也及时销毁编辑器
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return
      editor.destroy()
    })

    const handleCreated = (editor) => {
      editorRef.value = editor // 记录 editor 实例，重要！
    }

    return {
      inputValue: '',
      editorRef,
      valueHtml,
      mode: 'default', // 或 'simple'
      toolbarConfig,
      editorConfig,
      handleCreated
    };
  },
  methods: {
    saveToFile() {
      console.log("title" + ":" + this.inputValue);
      console.log(this.editorRef.getHtml());
      if (this.inputValue === null) {
        this.$message({
          type: "error",
          message: "请输入标题"
        });
      } else if (this.editorRef.getHtml() === '<p><br></p>') {
        this.$message({
          type: "error",
          message: "请输入内容"
        });
      } else if (sessionStorage.getItem("id") != null) {
        const jsonData = {
          cityId: this.$route.params.cityId,
          provinceId: this.$route.params.provinceId,
          title: this.inputValue,
          content: this.editorRef.getHtml(),
          id: parseInt(sessionStorage.getItem("id"))
        }
        request.put("journal", jsonData).then(res => {
          this.journalId = res.result;
          // console.log("journalId" + this.journalId)
          // window.open("details/" + this.journalId)
          this.$message({
            type: "success",
            message: "修改成功"
          });
          this.$router.push("/details/" + this.journalId);
          sessionStorage.setItem("provinceId", this.$route.params.provinceId)
          sessionStorage.setItem("cityId", this.$route.params.cityId)
        })

      } else {
        const jsonData = {
          cityId: this.$route.params.cityId,
          provinceId: this.$route.params.provinceId,
          title: this.inputValue,
          content: this.editorRef.getHtml(),
        }
        request.post("journal", jsonData).then(res => {
          this.journalId = res.result;
          // console.log("journalId" + this.journalId)
          // window.open("details/" + this.journalId)
          this.$message({
            type: "success",
            message: "添加成功"
          });
          this.$router.push("/details/" + this.journalId);
          sessionStorage.setItem("provinceId", this.$route.params.provinceId)
          sessionStorage.setItem("cityId", this.$route.params.cityId)
        })
            .catch(error => {
              this.$message({
                type: "error",
                message: "标题重复"
              });
            });

      }
    }
  }
}
</script>

<style scoped>
div {
  margin: 10px;
}

/* 给标签和输入框添加一些基本样式 */
label {
  font-weight: bold;
  margin-right: 5px;
}

input {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
}

/* 添加一些鼠标悬停和聚焦时的效果 */
input:hover,
input:focus {
  border-color: #4caf50; /* 你可以选择合适的颜色 */
  box-shadow: 0 0 5px rgba(76, 175, 80, 0.7);
}

.button {
  background-color: #409EFF;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin-left: 50%;
  margin-right: auto;
}

</style>
