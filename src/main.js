import Vue from 'vue'
import App from './App.vue'
import LatteUI from '@bybas/latte-ui'
import VueRouter from 'vue-router'
import Rooms from './components/Rooms'
import RoomsInGame from './components/Rooms/InGame';
import RoomsCreate from './components/Rooms/CreateRoom';
import JoinRoom from './components/Rooms/JoinRoom.vue'
import StartPage from './components/StartPage';
import VueSocketIO from 'vue-socket.io';
import SocketIO from 'socket.io-client';
import Vuex from 'vuex';
import VueClipboard from 'vue-clipboard2';

/**
 * Installing titles
 * https://stackoverflow.com/questions/36612847/how-can-i-bind-the-html-title-content-in-vuejs
 */


Vue.use(new VueSocketIO({
        debug: true,
        connection: SocketIO('http://127.0.0.1:3000')
    })
);


Vue.use(LatteUI);
Vue.use(VueRouter);
Vue.use(Vuex);
Vue.use(VueClipboard);

import "@bybas/latte-ui/src/scss/app.scss";
import "@mdi/font/css/materialdesignicons.css";
import './assets/css/style.css';

const store = new Vuex.Store({
    state: {
        currentPlayer: null,
        currentRoom: null,
        currentPlayers: null
    }
})
const latte = new LatteUI();


const router = new VueRouter({
    mode: 'history',
    routes: [
        {path: '/', component: StartPage},
        {
            path: '/rooms', component: Rooms,
            children: [
                {
                    path: 'create',
                    component: RoomsCreate
                },
                {
                    path: ':roomId',
                    component: RoomsInGame,
                },
                {
                    path: ':roomId/join',
                    component: JoinRoom,
                }
            ]
        }
    ]
});

Vue.config.productionTip = false

new Vue({
    render: h => h(App),
    router,
    store,
    latte
}).$mount('#app');


