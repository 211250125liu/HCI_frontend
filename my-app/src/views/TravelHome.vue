<template>
<!--  <NavBar/>-->
<!--  <PictureList/>-->
<!--  <ChineseMap/>-->
  <Button>
      <router-link to="JiangSu">
          ToJiangSu
      </router-link>
  </Button>
</template>

<script>
import NavBar from "@/components/NavBar.vue";
import PictureList from "@/components/PictureList.vue";
import ChineseMap from "@/App.vue";
import JiangSu from "@/components/JiangSu/JiangSu.vue";

export default {
    name: "TravelHome",
    components: {ChineseMap, PictureList, NavBar},
    data() {
        return{
            msg : "世界那么大，我想去看看"
        };
    }
}
</script>

<style scoped>

</style>
