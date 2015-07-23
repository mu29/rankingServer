var express = require('express');
var selectShow = require('./connection_pool').selectShow;
var executeQuery = require('./connection_pool').executeQuery;
var router = express.Router();
var pool = require('./connection_pool').pool;

router.post('/', function (req, res, next) {
    req.accepts('application/json');
    json = req.body;
    executeQuery("INSERT INTO `users` (`name`, `score`) VALUES ('" + json.name + "', '" + json.score + "');", res);
});

router.get('/:name', function (req, res, next) {
    var queryString = "SELECT * FROM `users` WHERE `name` = '" + req.params.name + "'";

    pool.getConnection(function (err, connection) {
        connection.query(queryString, function (err, rows) {
            if (err) {
                connection.release();
                res.json({ result: 'error' });
                throw err;
            }
            connection.release();
            res.render('users', { name: rows[0].name, score: rows[0].score });
            console.log(rows);
        });
    });
});

router.put('/', function (req, res, next) {
    req.accepts('application/json');
    json = req.body;
    executeQuery("UPDATE `users` SET `score` = '" + json.score + "' WHERE `name` = '" + json.name + "';", res);
});

router.delete('/:name', function (req, res, next) {
    executeQuery("DELETE FROM `users` WHERE `name` = '" + req.params.name + "';", res);
});

module.exports = router;
