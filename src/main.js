import { createApp } from 'vue'
import "./scss/app.scss";
import App from './App.vue'
import mitt from 'mitt';
import { store } from './store/store';
import Toast from "vue-toastification";

const emitter = mitt();
const app = createApp(App);
app.use(store)
app.use(Toast, {
    position: "top-center",
});

app.config.globalProperties.emitter = emitter;
app.mount('#app')
