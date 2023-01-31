import { createApp } from 'vue'
import App from './App.vue'
import './assets/tailwind.css'
const app = createApp(App)

app.config.unwrapInjectedRef = true
app.mount('#app');