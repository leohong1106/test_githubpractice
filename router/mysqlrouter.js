var express = require('express');
var mysql = require('mysql');
const dbconfig = require('./dbconfig');
const hasher = require('pbkdf2-password')();

var connection = mysql.createConnection(dbconfig);


module.exports = function () {
    var router = express.Router();

    router.get('/test', function (req, res) {
        connection.connect();

        connection.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
            if (error) throw error;

            console.log('The solution is: ', results[0].solution);
            res.json(results);

            connection.end();
        });
    });

    router.get('/getuser', function (req, res) {
        connection.connect();

        connection.query('SELECT * FROM user', function (error, results, fields) {
            if (error) throw error;

            console.log('results : ', results);
            res.json(results);

            connection.end();
        });
    });

    router.get('/adduser', function (req, res) {
        connection.connect();
        const query = `INSERT INTO user (userid, password, salt, email) VALUES ("zz", "zz", "zz", "zz@zz")`;
        connection.query(query, function (error, results, fields) {
            if (error) throw error;

            console.log('results : ', results);
            res.json(results);

            connection.end();
        });
    });


    // router.post('/adduser2', function (req, res) {
    //     console.log(req.body);

    //     let userid = req.body.userid;
    //     let password = req.body.password;
    //     let salt = 'salt';
    //     let email = req.body.email;
    //     let name = req.body.name;


    router.post('/adduser3', function (req, res) {
        console.log(req.body);

        let userid = req.body.userid;
        let password = req.body.password;
        let salt = 'salt';
        let name = req.body.name;
        let email = req.body.email;

        hasher({
            password: password
        }, (err, pass, salt, hash) => {
            if (err) {
                console.log('ERR: ', err);
                res.redirect('/signup_form');
            }
            connection.connect();
            const stmt = `INSERT INTO user (userid, password, salt, name, email) VALUES (?, ?, ?, ?, ?)`;
            connection.query(stmt, [userid, hash, salt, name, email], function (error, results, fields) {
                if (error) throw error;

                console.log('results : ', results);
                res.json(results);

                connection.end();
            });
        })
    });



    router.post('/signin', function (req, res) {
        console.log(req.body);

        let userid = req.body.id;
        let password = req.body.password;

        connection.connect();
        const stmt = 'SELECT * FROM user WHERE userid = ? ';
        connection.query(stmt, [userid], function (error, results, fields) {
            connection.end();

            if (error) throw error;

            console.log('results : ', results);

            if (results) {
                const user = results[0];
                console.log(userid, "정보가 존재합니다.");
                console.log(user);

                hasher({
                    password: password,
                    salt: user.salt
                }, (err, pass, salt, hash) => {
                    console.log('hash : ', hash);
                    console.log('pass : ', user.password);

                    if (hash === user.password) {
                        console.log('로그인 성공');
                        req.session.user = user;
                        res.redirect('/');
                    } else {
                        console.log('패스워드가 맞지 않습니다');
                        res.redirect('/mysql/login_form');
                    }
                });
            } else {
                res.send('유저 정보가 존재하지 않습니다.');
            }
        });

    });






    // hasher({
    //     password: password
    // }, (err, pass, salt, hash) => {
    //     if (err) {
    //         console.log('ERR: ', err);
    //         res.redirect('/signup_form');
    //     }
    //     connection.connect();
    //     const stmt = `INSERT INTO user (userid, password, salt, name, email) VALUES (?, ?, ?, ?, ?)`;
    //     connection.query(stmt, [userid, hash, salt, name, email], function (error, results, fields) {
    //         if (error) throw error;

    //         console.log('results : ', results);
    //         res.json(results);

    //         connection.end();
    //     });
    // })

    // // res.send(userid);
    // connection.connect();
    // const stmt = `INSERT INTO user (userid, password, salt, name, email) VALUES (?,?,?,?,?)`;
    // connection.query(stmt, [userid, password, salt, name, email], function (error, results, fields) {
    //     if (error) throw error;

    //     console.log('results : ', results);
    //     res.json(results);

    //     connection.end();
    // });



    router.get('/adduser_form', (req, res) => {
        res.render('signup_page.html');
    });


    router.get('/login_form', (req, res) => {
        res.render('signin_page.html');
    });


    return router;
}
