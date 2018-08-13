var express = require('express');
var router = express.Router();

var User = require('../models/User');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* GET signup page. */
router.get('/signup', function(req, res, next) {
  res.render('commons/sign-up', { title: 'Signup' });
});

/* POST signup action. */
router.post('/signup', function(req, res, next) {
    var params = [req.body.name, req.body.email, req.body.password];
    User.findByEmail(req.body.email, function(err, rows){
        if (err) next(err);
        if(rows.length > 0){
            req.flash('warning', 'Duplicated email!!');
            res.redirect('/signup');
        }else{
            User.add(params, function(err2, result){
                if (err2) next(err2);
                res.render('commons/sign-up-success', { title: 'Signup success' });
            });
        }
    });
});

/* POST email duplication check. */
router.post('/dupemail', function(req, res, next) {
    User.findByEmail(req.body.email, function(err, rows){
        if (err) next(err);
        if(rows.length > 0){
            res.json({ status: true, msg:'Duplicated email!'});
        }else{
            res.json({ status: false });
        }
    });
});

/* GET signin page. */
router.get('/signin', function(req, res, next) {
    var email = (req.cookies.email)?req.cookies.email:'';
    res.render('commons/sign-in', { title: 'Signin', email:email });
});

/* POST signin action. */
router.post('/signin', function(req, res, next) {
    User.findByEmail(req.body.email, function(err, users){
        if(err) next(err);
        if(users.length == 0 || !User.compare(req.body.password, users[0].password)){
            req.flash('warning', 'Your email does not exist or password is invalid.');
            res.redirect('/signin');
        }else { // user exists
            req.session.user = { uid: users[0].uid, name: users[0].name, email: users[0].email, role:users[0].role};
            if(req.body.rememberme) res.cookie('email',users[0].email, { maxAge: 86400 * 7, httpOnly: true });
            else res.cookie('email', '', {maxAge: 0});
            if(users[0].role == 'ADMIN'){
                res.redirect('/admin');
            }else{
                res.redirect('/members');
            }

        }
    });
});

/* GET login page. */
router.get('/login', function(req, res, next) {
  res.render('commons/login', { title: 'Login' });
});

/* POST signin action. */
router.post('/login', function(req, res, next) {
    User.findByEmail(req.body.email, function(err, users){
        if(err) next(err);
        if(users.length == 0 || !User.compare(req.body.password, users[0].password)){
            res.json({ status: false, msg:'Your email does not exist or password is invalid.'});
        }else { // user exists
            req.session.user = { uid: users[0].uid, name: users[0].name, email: users[0].email, role:users[0].role};
            res.json({ status: true});
        }
    });
});

/* GET signout. */
router.get('/signout', function(req, res, next) {
    req.session.destroy();
    res.redirect('/');
});

module.exports = router;
