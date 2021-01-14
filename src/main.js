import Vue from 'vue'
import App from './App.vue'

import VueRouter from "vue-router"
import HelloWorld from "@/components/HelloWorld";
import Login from "@/components/Login";
import Quiz from "@/components/Quiz";
import Home from "@/components/Home";

Vue.config.productionTip = false
Vue.use(VueRouter);

// require("bootstrap/dist/css/bootstrap.min.css");
// require("bootstrap/dist/js/bootstrap.min");



const router = new VueRouter({
  routes: [
    { path: '/hello', name: 'HelloWorld', component: HelloWorld},
    { path: '/Login', name: 'Login', component: Login},
    { path: '/Quiz', name: 'Quiz', component: Quiz},
    { path: '/Home', name: 'Home', component: Home},
  ],
  mode: 'history',
});
new Vue({
  router,


  render: h => h(App),
}).$mount('#app')
