import { createRouter, createWebHistory } from 'vue-router'
import { ElNotification } from "element-plus";
import {h} from "vue";

let routes = [
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '/home',
        name: "name",
        component: () => import('../views/home.vue'),
        redirect: '/TravelHome',
        children: [
            {
                name: "TravelHome",
                path: '/TravelHome',
                component: () => import('../views/TravelHome.vue'),
            }
        ],
    },
    {
        name: "TravelHome",
        path: '/TravelHome',
        component: () => import('../views/TravelHome.vue'),
    },
    {
        name: "login",
        path: '/login',
        component: () => import('../views/login.vue'),
    },

    {
        name: 'register',
        path: '/register',
        component: () => import('../views/register.vue')
    },
    {
        name: 'picture_collection',
        path: '/picture_collection/:provinceId/:cityId',
        component: () => import('../views/picture_collection.vue')
    },
    {
        name: 'journal',
        path: '/journal/:provinceId/:cityId',
        component: () => import('../views/journal.vue')
    },
    {
        name: 'details',
        path: '/details/:journalId',
        component: () => import('../views/details.vue')
    },
    {
        name: 'settings',
        path: '/settings',
        component: () => import('../views/settings.vue')
    },
    {
        name: 'chat',
        path: '/chat',
        component: () => import('../components/chat.vue')
    }
]
const router = createRouter({
    routes,
    history: createWebHistory(),
})

router.beforeEach((to, from, next) => {
    const isLogin = localStorage.getItem('isLogin') === 'true'; // 检查登录状态
    if(to.path === '/register'){
        next();
    }
    else if (to.path !== '/login' && !isLogin) {
        // 如果未登录且尝试访问非登录页面，则阻止跳转并提示用户
        ElNotification({
            title: '跳转失败',
            message: h('i', { style: 'color: teal' }, '请先登录'),
        })
        next('/login'); // 可以将用户重定向到登录页或其他页面
    } else {
        next(); // 如果已登录或访问的是登录页面，则允许跳转
    }
});

export default router;

