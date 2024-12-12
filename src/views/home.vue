<template>
    <div>
        <header>
            <NavBar />
        </header>
    </div>
    <div id="home">
        <router-view />
    </div>
    <chat/>
</template>

<script>
import NavBar from "../components/NavBar.vue";
import TravelHome from "../views/TravelHome.vue";
import Chat from "../components/chat.vue";

export default {

    name: "home",
    components: { Chat, TravelHome, NavBar },

    created() {
        const storedValue = localStorage.getItem('isLogin');
        if (!storedValue) {
            localStorage.setItem("isLogin", 'false')
        }
    }
}

</script>

<style scoped>
header {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: 1000;
}

#home {
    position: absolute;
    top: 60px;
    width: 100%;
    padding: 0;
    border: 0;
    margin: 0;
    height: max-content;
    left: 0;
    background-size: 100% 100%;
    /*background-color: #efefef;*/
    /*min-height: 100vh;*/
}
</style>

