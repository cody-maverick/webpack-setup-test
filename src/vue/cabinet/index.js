import Vue from 'vue'
import App from './App/app.vue';

const log = () => {
    console.log('es6')
}

log();

new Vue({
    el: '#app',
    render: h => h(App)
});