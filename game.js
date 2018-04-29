/**
 * Получаем данные для игры
 * @param {*} n 
 */
let getGameData = (n) => {

    let data = [];
    let values = createDataValues(n);

    for(let i = 0; i < n; i++) {
        data[i] = [];
        for(let j = 0; j < n; j++) {

            let state = getState(i, j, n);
            let value = state == -1 ? 0 : getValue(values);
            
            data[i][j] = {
                state: state,
                value: value
            };
        }
    }

    return data;
}

/**
 * Создаем набор данных
 */
let createDataValues = (n) => {

    let values = [];
    let count = Math.floor(n * n / 2);

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
let getValue = (values) => {

    let index = -1;
    
    while(index == -1) {
        
        index = rand(1, values.length);
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
let getState = (i, j, n) => {

    if(n % 2 == 0) {
        return 0;
    }

    let middle = Math.floor(n / 2);

    if(i != middle || j != middle) {
        return 0;
    }

    return -1;
}

/**
 * Получить рандомное число
 * @param {*} min 
 * @param {*} max 
 */
let rand = (min, max) => {
    var n = min - 0.5 + Math.random() * (max - min + 1);
    n = Math.round(n);
    return n;
}

// let k = 6;
// let d = getGameData(k);

// console.log('result:');
// for(let i = 0; i < k; i++) {

//     let row = [];
//     for(let j = 0; j < k; j++) {
//         row[j] = d[i][j].value < 10 ? ' ' + d[i][j].value : d[i][j].value;
//     }
//     console.log(row.join(' '));
// }