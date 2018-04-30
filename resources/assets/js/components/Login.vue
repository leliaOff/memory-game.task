<template>
    <div>
        <div class="form">
            <div class="alert alert-info" v-if="state === 0">Укажите имя пользователя, что бы начать игру</div>
            <div class="alert alert-danger" v-if="state == -1">Имя пользователя не может быть пустым!</div>
            <div class="form-group">
                <input 
                    class="form-control" 
                    id="username-input" aria-describedby="username-help" 
                    placeholder="укажите имя пользователя"
                    v-model="username">
            </div>
            <div class="form-group">
                <button type="submit" class="btn btn-primary" @click="login">Начать</button>
            </div>
        </div>
    </div>
</template>

<script>

    export default {

        data() {
            return {
                username    : '',
                state       : 0
            }
        },

        methods: {
            
            login() {

                axios.get(`login?username=${this.username}`).then(response => {     
                    
                    if(response.data == '') {
                        this.state = -1;
                    } else {
                        this.$emit('onLogin', this.username);
                    }

                }).catch(error => {
                    // ...
                });

            }
            
        },

    }
</script>