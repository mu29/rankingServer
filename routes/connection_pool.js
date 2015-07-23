var mysql = require('mysql');

var connectionPool = mysql.createPool({
    host :'localhost',
    port : 3306,
    user : 'root',
    password : 'projectDanbi',
    database : 'ranking',
    connectionLimit : 20,
    waitForConnections : true
});

var selectShow = function(queryString, res) {
    connectionPool.getConnection(function (err, connection) {
        connection.query(queryString, function (err, rows) {
            if (err) {
                connection.release();
                res.json({ result: 'error' });
                throw err;
            }
            connection.release();
            res.json(rows);
            console.log(rows);
        });
    });
};

var executeQuery = function(queryString, res) {
    connectionPool.getConnection(function (err, connection) {
        connection.query(queryString, function (err, rows) {
            if (err) {
                connection.release();
                res.json({ result: 'error' });
                throw err;
            }
            connection.release();
            res.json({ result: 'success' });
        });
    });
};

module.exports.selectShow = selectShow;
module.exports.executeQuery = executeQuery;
module.exports.pool = connectionPool;