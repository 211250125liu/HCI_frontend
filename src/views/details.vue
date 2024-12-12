<template>
  <div :style="{ backgroundImage: 'url(' + backgroundImage + ')' }" class="background">
    <div class="title">{{ title }}</div>
  </div>
  <div v-html="htmlContent" class="html-container" id="editableDiv"></div>
  <el-button :disabled="first" :icon="EditPen" class="edit" @click="edit">修改游记</el-button>
</template>
<script>
import {request} from "../utils/request";
import {EditPen, Finished} from "@element-plus/icons-vue";
import router from "../router";

export default {
  computed: {
    Finished() {
      return Finished
    },
    EditPen() {
      return EditPen
    }
  },
  data() {
    return {
      first: false,
      title: '',
      htmlContent: [],
      praseHtml: [],
      backgroundImage: '',
      editedContent: '',
      provinceId: '',
      cityId: '',
      journalId: '',
    };
  },
  mounted() {
    this.fetchAll().then(journal => {
      this.title = journal.title;
      this.htmlSourceContent = journal.content;
      this.htmlContent = this.htmlSourceContent.replace(/<img/g, '<img style="width: 100%; height: auto;"');
      this.provinceId = journal.provinceId;
      this.cityId = journal.cityId;
      this.journalId = journal.id;

      const parser = new DOMParser();
      const parsedHtml = parser.parseFromString(journal.content, 'text/html');

      this.backgroundImage = parsedHtml.querySelectorAll('img')[0].getAttribute('src');

      console.log("image", this.backgroundImage)
    })
  },
  methods: {
    async fetchAll() {
      console.log(this.$route.params.journalId)
      return await request.get("/journal/" + this.$route.params.journalId);
    },
    edit() {
      this.first = true;
      let editedContent = document.getElementById('editableDiv').innerHTML;
      sessionStorage.setItem("content", editedContent);
      sessionStorage.setItem("title", this.title);
      sessionStorage.setItem("id", this.journalId);
      console.log(editedContent);
      router.push('/journal/' + this.provinceId + '/' + this.cityId)
    },
  }
};
</script>
<style scoped>
.background {
  position: relative;
  width: 100%;
  height: 400px;
  background-size: cover;
  background-position: center;
}

.title {
  position: absolute;
  bottom: 12%;
  left: 10%;
  font-size: 40px;
  color: white;
  font-weight: bold;
  font-family: 宋体;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
}

.html-container {
  position: static;
  padding: 20px;
  /*//上下 左右*/
  margin: 10px 15%;
  background-color: #ffffff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 70%;
}

.edit {
    position: fixed;
    top: 80px;
    right: 50px;
    background-color: #409eff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}
</style>

