class MemoryGame {

    constructor(n) {
        this.n = n;
        this.count = n * n;
    }

    /**
     * Получаем данные для игры
     */
    getGameData() {

        let data = [];
        let values = this.createDataValues();
    
        for(let i = 0; i < this.count; i++) {
            
            let state = this.getState(i);
            let value = state == -1 ? 0 : this.getValue(values);
            
            data[i] = {
                id: (i + 1),
                state: state,
                value: value
            };
        }
    
        return data;
    }

    /**
     * Создаем набор данных
     */
    createDataValues() {

        let values = [];
        let count = Math.floor(this.count / 2);

        for(let i = 0; i < count; i++) {
            values[i] = 0;
        }

        return values;

    }

    /**
     * Получить переменную для сетки
     * @param {*} values 
     * @param {*} n 
     */
    getValue(values) {

        let index = -1;
        
        while(index == -1) {
            
            index = this.rand(1, values.length);
            if(values[index - 1] == 2) {
                index = -1;
            }

        }

        values[index - 1]++;
        return index;

    }

    /**
     * Получаем состояние
     * @param {*} i 
     * @param {*} j 
     * @param {*} n 
     */
    getState(i) {

        if(this.n % 2 == 0) {
            return 0;
        }

        if(i != Math.floor(this.count / 2)) {
            return 0;
        }

        return -1;
    }

    /**
     * Получить рандомное число
     * @param {*} min 
     * @param {*} max 
     */
    rand(min, max) {
        var n = min - 0.5 + Math.random() * (max - min + 1);
        n = Math.round(n);
        return n;
    }
}

module.exports = MemoryGame;

