var mysql   = require('mysql');

class DbHelper {

    constructor(host, user, password, database) {
        
        this.connectConfiguration = {
            host     : host,
            user     : user,
            password : password,
            database : database
        };

    }

    /**
     * Получаем данные для игры
     */
    getQuery(query, params, fn) {
        
        let connection = mysql.createConnection(this.connectConfiguration);
        connection.connect();    
        connection.query(query, params, fn);
        connection.end();

    }

}

module.exports = DbHelper;

