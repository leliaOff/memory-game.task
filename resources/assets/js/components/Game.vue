<template>
    <div class="wrapper" :class="'back-' + level">

        <div id="top-menu" :class="'back-' + level">
            <h3>Добро пожаловать, {{ username }}</h3>
            <h3>Уровень {{ level }}</h3>
            <button type="submit" class="btn btn-outline-light clean" @click="clean">Начать с начала</button>
            <button type="submit" class="btn btn-outline-light logout" @click="logout">Закончить</button>
        </div>

        <div class="content" v-if="game">

            <button type="submit" class="btn btn-outline-light btn-block" v-if="game.isFinish()" @click="getLevel">Следующий уровень</button>
            <div id="playing-field" v-else>
                <div class="row">
                    <div v-bind:class="{ cell: true, active: card.isActive(), open: card.isOpened() }" v-for="(card, i) in game.getCards()" :key="card.id" :style="'width: ' + (100 / level) + '%'">
                        <div :class="'item back-' + level" @click="clickCard(card)">
                            <div :class="'card card-' + card.value"></div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>

    import Game from '../domains/Game';
    import CardsCollection from '../domains/CardsCollection';

    export default {

        props: ['username'],

        data() {
            return {
                level       : 0,    //номер текущего уровня
                opened      : [],   //список ссылок на открытые карточки
                attempts    : 0,    //попытки
                autoClose   : 0,    //состояние для автозакрытия карточек

                game        : false
            }
        },

        methods: {

            getLevel() {

                axios.get(`level`).then(response => {
                    
                    this.game = new Game(new CardsCollection(response.data.game));
                    let a = this.game.getCards();

                    this.level      = response.data.level;
                    this.attempts   = 0;

                }).catch(error => {
                    // ...
                });

            },

            clickCard(card) {

                let result = this.game.selectCard(card);
                this.attempts += result;

                if(this.game.isFinish()) {
                    this.finish();
                }

            },


            finish() {

                axios.get(`save?level=${this.level}&attempts=${this.attempts}`).then(response => {     
                    // ...
                }).catch(error => {
                    // ...
                });

            },

            clean() {

                axios.get(`clean`).then(response => {     
                    
                    this.getLevel();

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