<template>
    <div class="wrapper" :class="'back-' + level">

        <div id="top-menu" :class="'back-' + level">
            <h3>Добро пожаловать, {{ username }}</h3>
            <h3>Уровень {{ level }}</h3>
            <button type="submit" class="btn btn-outline-light logout" @click="logout">Закончить</button>
        </div>

        <div class="content">

            <button type="submit" class="btn btn-outline-light btn-block" v-if="left == 0" @click="getLevel">Следующий уровень</button>
            <div id="playing-field" v-else>
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
                gameData    : [],   //данные игры
                level       : 0,    //номер текущего уровня
                opened      : [],   //список ссылок на открытые карточки
                left        : -1,   //сколько ещё осталось открытых карточек
                attempts    : 0,    //попытки
                autoClose   : 0,    //состояние для автозакрытия карточек
            }
        },

        methods: {

            getLevel() {

                axios.get(`level`).then(response => {
                    
                    this.start(response.data);

                }).catch(error => {
                    // ...
                });

            },

            start(data) {
                
                if(data == '') {
                    this.$emit('onLogout');
                }
                
                this.gameData   = data;
                this.level      = this.gameData.length;
                this.left       = Math.floor(this.level * this.level / 2);
                this.attempts   = 0;
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

                this.attempts++;

                if(this.opened[0].value != this.opened[1].value) {
                    this.autoClose = setTimeout(() => { this.setStateCards(0) }, 500);
                } else {
                    this.setStateCards(-1);
                    this.left--;
                }

                if(this.left == 0) {
                    this.finish();
                }

            },

            setStateCards(state) {

                clearTimeout(this.autoClose);

                for(let i in this.opened) {
                    this.opened[i].state = state;
                }
                this.opened = [];

            },

            finish() {

                axios.get(`save?level=${this.level}&attempts=${this.attempts}`).then(response => {     
                    // ...
                }).catch(error => {
                    // ...
                });

            },

            logout() {
                
                axios.get(`logout`).then(response => {     
                    
                    this.$emit('onLogout');

                }).catch(error => {
                    // ...
                });
            },

        },

        mounted() {
            this.getLevel();
        }

    }
</script>