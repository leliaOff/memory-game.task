var DbHelper = require('./DbHelper.js');

class GameResult {

    constructor() {        
        this.db = new DbHelper('localhost', 'memory_game', 'memory_game', 'memory_game');
    }

    /**
     * Получить последний пройденный уровень
     * @param {*} username 
     */
    getMaxLevel(username, callback) {
        
        let query = "SELECT max(level) as level FROM results WHERE username = ?";

        let fn = (error, result, fields) => {
            
            if(error) {
                callback(error, null);
            } else {
                let level = !result[0].level ? 1 : (result[0].level > 15 ? 15 : result[0].level);
                callback(null, level);
            }

        };

        this.db.getQuery(query, [username], fn);

    }

    /**
     * Сохранить результаты пользователя
     */
    saveResult(username, level, timeout, attempts, callback) {

        let query = "INSERT INTO results (username, level, timeout, attempts) VALUES (?, ?, ?, ?)";

        let fn = (error, result, fields) => {

            if(error) {
                callback(error, null);
            } else {
                callback(null, '');
            }

        };

        this.db.getQuery(query, [username, level, timeout, attempts], fn);

    }

    /**
     * Сбросить пользовательские достижения
     */
    cleanResult(username, callback) {

        let query = "DELETE FROM results WHERE username = ?";

        let fn = (error, result, fields) => {

            if(error) {
                callback(error, null);
            } else {
                callback(null, '');
            }

        };

        this.db.getQuery(query, [username], fn);

    }

    /**
     * Получить все результаты
     */
    getAllResults(callback) {

        let query = "SELECT * FROM results";

        let fn = (error, result, fields) => {
            
            if(error) {
                callback(error, null);
            } else {
                callback(null, this.resultCalculate(result));
            }

        };

        this.db.getQuery(query, [], fn);

    }

    /**
     * Подсчитать результаты
     */
    resultCalculate(result) {

        let usersResults = {};
        for(let i in result) {

            let username = result[i].username;
            let points = this.getPoints(result[i].level, result[i].timeout, result[i].attempts);

            if(!usersResults[username]) {
                usersResults[username] = points;
            } else {
                usersResults[username] += points;
            }
        }

        return this.sortResult(usersResults);

    }

    /**
     * Подсчитать очки
     */
    getPoints(level, timeout, attempts) {
        level = level % 2 == 0 ? level * level : level * level - 1;
        let combinations = (level * (level - 1)) / 2;
        let attemptsPoints = combinations / attempts;
        let timeoutPoints = combinations / timeout;
        return Math.round(attemptsPoints * timeoutPoints);
    }

    /**
     * Осортировать результаты
     */
    sortResult(result) {
        
        let sortable = [];
        for (let i in result) {
            sortable.push([i, result[i]]);
        }

        sortable.sort(function(a, b) {
            return b[1] - a[1];
        });

        return sortable;
    }

}

module.exports = GameResult;