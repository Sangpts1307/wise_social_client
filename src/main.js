import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
// Import vue socket.io library
import VueSocketIO from 'vue-3-socket.io'; // Vue 3 compatible plugin
import SocketIO from 'socket.io-client';

const app = createApp(App)

app.use(new VueSocketIO({
    debug: true,
    connection: SocketIO("http://127.0.0.1:3000"),
    // vuex: {
    //     store,
    //     actionPrefix: 'SOCKET_',
    //     mutationPrefix: 'SOCKET_'
    // },
    options: {
        path: "/socket.io"
    }
}));

app.use(router)

app.mount('#app')
