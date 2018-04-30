import Vue from 'vue';

window._ = require('lodash');
window.axios = require('axios');
window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

import WelcomeComponent from './components/Welcome';
Vue.component('welcome-component', WelcomeComponent);

var app = new Vue({
    el: '#app',
    data: {
        user: ''
    }
});