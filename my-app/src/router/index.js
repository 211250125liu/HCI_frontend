import TravelHome from '@/views/TravelHome.vue'
import HelloWorld from "../components/simple.vue";
import {createRouter, createWebHistory} from 'vue-router'
import JiangSu from "@/components/JiangSu/JiangSu.vue";

const routerHistory = createWebHistory()

const router = createRouter({
    history: routerHistory,
    routes:[
        {
            path: '/',
            name: 'HelloWorld',
            component: HelloWorld
        },
        {
            path: '/TravelHome',
            name: 'TravelHome',
            component: TravelHome,
        },
        {
            path: '/JiangSu',
            name: 'JiangSu',
            component: JiangSu,
        },
    ]
})
export default router
