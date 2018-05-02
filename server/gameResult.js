var mysql   = require('mysql');

var connectConfiguration = {
    host     : 'localhost',
    user     : 'memory_game',
    password : 'memory_game',
    database : 'memory_game'
};

/**
 * Получение результатов из БД
 * @param {*} query 
 * @param {*} params 
 * @param {*} fn 
 */
let sqlConnection = (query, params = [], fn) => {        
    
    let connection = mysql.createConnection(connectConfiguration);
    connection.connect();    
    connection.query(query, params, fn);
    connection.end();
    
};

/**
 * Получить последний пройденный уровень
 * @param {*} username 
 */
exports.getMaxLevel = (username, callback) => {
    
    let query = "SELECT max(level) as level FROM results WHERE username = ?";

    let fn = (error, result, fields) => {
        
        if(error) {
            callback(error, null);
        } else {
            let level = !result[0].level ? 1 : (result[0].level > 15 ? 15 : result[0].level);
            callback(null, level);
        }

    };

    sqlConnection(query, [username], fn);

}

exports.saveResult = (username, level, timeout, attempts, callback) => {

    let query = "INSERT INTO results (username, level, timeout, attempts) VALUES (?, ?, ?, ?)";

    let fn = (error, result, fields) => {

        if(error) {
            callback(error, null);
        } else {
            callback(null, '');
        }

    };

    sqlConnection(query, [username, level, timeout, attempts], fn);

}

exports.cleanResult = (username, callback) => {

    let query = "DELETE FROM results WHERE username = ?";

    let fn = (error, result, fields) => {

        if(error) {
            callback(error, null);
        } else {
            callback(null, '');
        }

    };

    sqlConnection(query, [username], fn);

}

exports.getAllResults = (callback) => {

    let query = "SELECT * FROM results";

    let fn = (error, result, fields) => {
        
        if(error) {
            callback(error, null);
        } else {
            callback(null, resultCalculate(result));
        }

    };

    sqlConnection(query, [], fn);

}

let resultCalculate = (result) => {

    let usersResults = {};
    for(let i in result) {

        let username = result[i].username;
        let points = getPoints(result[i].level, result[i].timeout, result[i].attempts);

        if(!usersResults[username]) {
            usersResults[username] = points;
        } else {
            usersResults[username] += points;
        }
    }

    return sortResult(usersResults);

}

let getPoints = (level, timeout, attempts) => {
    level = level % 2 == 0 ? level * level : level * level - 1;
    let combinations = (level * (level - 1)) / 2;
    let attemptsPoints = combinations / attempts;
    let timeoutPoints = combinations / timeout;
    return Math.round(attemptsPoints * timeoutPoints);
}

let sortResult = (result) => {
    
    let sortable = [];
    for (let i in result) {
        sortable.push([i, result[i]]);
    }

    sortable.sort(function(a, b) {
        return b[1] - a[1];
    });

    return sortable;
}