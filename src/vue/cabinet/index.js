import Vue
    from 'vue'
import App
    from './App/app.vue';

const log = () => {
    console.log('es11')
}

log();

new Vue({
    el: '#app',
    render: h => h(App)
});