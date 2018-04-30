var mysql   = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'memory_game',
    password : 'memory_game',
    database : 'memory_game'
});
connection.connect();

/**
 * Получить последний пройденный уровень
 * @param {*} username 
 */
exports.getLevel = (username) => {

    let query = `SELECT max(level) as level FROM results WHERE username = '?'`;
    let level = 1;

    connection.query(query, username, getMaxLevel);

}

let getMaxLevel = (error, result, fields) => {
        
    if(error) throw error;
    
    if(result[0].level) {
        return result[0].level;
    } else {
        return 1;
    }

};