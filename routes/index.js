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
  res.render('commons/sign-in', { title: 'Signin' });
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
            res.redirect('/');
        }
    });
});

module.exports = router;
