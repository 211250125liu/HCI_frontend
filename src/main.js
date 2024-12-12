import './assets/main.css'

import App from './App.vue'
import { createApp } from 'vue'
import router from "./router";
import ElementPlus from 'element-plus'
import store from './store'

import 'element-plus/dist/index.css'
import Particles from 'particles.vue3'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
const app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(store)
app.use(router)
app.use(ElementPlus)
app.use(Particles)
app.mount('#app')

// app.config.globalProperties.$router
