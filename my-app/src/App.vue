<template>
  <TravelHome/>
</template>

<script>
import ChineseMap from "@/components/ChineseMap.vue";
import TravelHome from "@/views/TravelHome.vue";

export default {
  name: 'App',
    components: {TravelHome},
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
