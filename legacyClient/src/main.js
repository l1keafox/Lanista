import { createApp } from "vue";
import "./assets/tailwind.css";
import "vue-global-api";
import App from "./App.vue";

const app = createApp(App);

app.mount("#app");
