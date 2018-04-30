<template>
    <div class="wrapper" :class="'back-' + level">

        <div id="top-menu" :class="'back-' + level">
            <h3>Добро пожаловать, {{ username }}</h3>
            <button type="submit" class="btn btn-outline-light logout" @click="logout">Закончить</button>
        </div>

        <div class="content">
            <div id="playing-field">
                <div class="row" v-for="(row, i) in gameData" :key="i">
                    <div v-bind:class="{ cell: true, active: cell.state != -1, open: cell.state == 1 }" v-for="(cell, j) in row" :key="j" :style="'width: ' + (100 / level) + '%'">
                        <div :class="'item back-' + level" @click="openCard(cell)">
                            <div :class="'card card-' + cell.value"></div>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    </div>
</template>

<script>

    export default {

        props: ['username'],

        data() {
            return {
                gameData    : [],
                level       : 0,
                opened      : []
            }
        },

        methods: {

            getLevel() {

                axios.get(`level`).then(response => {     
                    
                    this.gameData = response.data;
                    this.level = this.gameData.length;

                }).catch(error => {
                    // ...
                });

            },

            openCard(cell) {
                
                if(this.opened.length == 2) {
                    this.setStateCards(0);
                }

                cell.state = 1;
                this.opened.push(cell);

                this.checkCards();

            },

            checkCards() {

                if(this.opened.length < 2) {
                    return;
                }

                if(this.opened[0].value != this.opened[1].value) {
                    setTimeout(() => { this.setStateCards(0) }, 500);
                } else {
                    this.setStateCards(-1);
                }

            },

            setStateCards(state) {

                for(let i in this.opened) {
                    this.opened[i].state = state;
                }
                this.opened = [];

            },

            logout() {
                
                axios.get(`logout`).then(response => {     
                    
                    this.$emit('onLogout');

                }).catch(error => {
                    // ...
                });
            }

        },

        mounted() {
            this.getLevel();
        }

    }
</script>