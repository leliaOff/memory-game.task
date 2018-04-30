<template>
    <div>
        <div class="alert alert-warning" v-if="state === 0">идет загрузка ...</div>
        <div v-else>
            <login-form v-if="username == ''" v-on:onLogin="onLogin"></login-form>
            <game :username="username" v-else v-on:onLogout="onLogout"></game>
        </div>
    </div>
</template>

<script>

    import Login from './Login.vue';
    import Game from './Game.vue';

    export default {

        components: {
            LoginForm   : Login,
            Game        : Game,
        },

        data() {
            return {
                username    : '',
                state       : 0
            }
        },

        methods: {
            
            loadUser() {
                
                axios.get('welcome').then(response => {     
                    this.username   = response.data;
                    this.state      = 1;
                }).catch(error => {
                    // ...
                });

            },

            onLogin(username) {
                this.username   = username;
                this.state      = 1;
            },

            onLogout() {
                this.username   = '';
                this.state      = 0;
                this.loadUser();
            }
            
        },

        mounted() {
            this.loadUser();
        }

    }
</script>