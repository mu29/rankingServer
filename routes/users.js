var express = require('express');
var nosql = require('./nosql');
var router = express.Router();

router.post('/', function (req, res, next) {
    req.accepts('application/json');
    json = req.body;
    var args = [ 'users', json.score , json.id];

    nosql.zadd(args, function (err, response) {
        if (err) {
            res.json({ result: 'error' });
            throw err;
        }
        res.render('users', { name: json.id, score: json.score });
    });
});

router.get('/:name', function (req, res, next) {
    var args = [ 'users', req.params.name];
    nosql.zscore(args, function (err, response) {
        if (err) {
            res.json({ result: 'error' });
            throw err;
        }
        res.render('users', { name: req.params.name, score: response });
    });
});

router.put('/', function (req, res, next) {
    req.accepts('application/json');
    json = req.body;
    var args = [ 'users', json.score , json.id];

    nosql.zadd(args, function (err, response) {
        if (err) {
            res.json({ result: 'error' });
            throw err;
        }
        res.render('users', { name: json.id, score: json.score });
    });
});

router.delete('/:name', function (req, res, next) {
    var args = [ 'users', req.params.name ];
    nosql.zrem(args, function (err, response) {
        if (err) {
            res.json({ result: 'error' });
            throw err;
        }
        res.json({ result: 'success' });
    });
});

module.exports = router;
