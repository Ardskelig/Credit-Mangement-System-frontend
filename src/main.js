// import './assets/main.css'

import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import App from './App.vue'
import router from './router'
import ECharts from 'vue-echarts'
import 'echarts'

const app = createApp(App)

app.use(router)
app.use(ElementPlus)
app.component('ECharts',ECharts)
app.mount('#app')
