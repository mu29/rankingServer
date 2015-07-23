var express = require('express');
var selectShow = require('./connection_pool').selectShow;
var pool = require('./connection_pool').pool;
var router = express.Router();

router.get('/ranking/:start/:limit', function (req, res, next) {
    var start = req.params.start;
    var limit = req.params.limit > 100 ? 100 : req.params.limit;
    var queryString = "SET @myRank := 0, @tempRank := 0, @prevScore := NULL; ";

    pool.getConnection(function (err, connection) {
        connection.query(queryString, function (err, rows) {
            if (err) {
                connection.release();
                res.json({ result: 'error' });
                throw err;
            }
            connection.release();

            //selectShow(queryString, res);
            pool.getConnection(function (err, connection) {
                queryString = "SELECT name, score, rank FROM " +
                    "(SELECT name, score, @tempRank := @tempRank + 1, @myRank := IF(@prevScore = score, @myRank, @tempRank) " +
                    "AS rank, @prevScore := score FROM users ORDER BY score DESC) temp LIMIT " + start + ", " + limit + ";";

                connection.query(queryString, function (err, rows) {
                    if (err) {
                        connection.release();
                        res.json({ result: 'error' });
                        throw err;
                    }
                    connection.release();
                    res.json(rows);
                });
            });
        });
    });
});

router.get('/ranking/:name', function(req, res, next) {
    selectShow("SELECT count(*) + 1 AS rank FROM users WHERE score >= (SELECT score FROM users WHERE name = '" + req.params.name + "');", res);
});

router.get('/users/:name', function (req, res, next) {
    selectShow("SELECT * FROM `users` WHERE `name` = '" + req.params.name + "'", res);
});

module.exports = router;
