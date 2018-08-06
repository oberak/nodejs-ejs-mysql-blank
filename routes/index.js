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
        if (err) throw err;
        if(rows.length > 0){
            req.flash('warn', 'Duplicated email!!');
            res.redirect('/signup');
        }else{
            User.add(params, function(err2, result){
                if (err2) throw err2;
                res.redirect('/signin');
            });
        }
    });

});

/* GET signup page. */
router.get('/signin', function(req, res, next) {
  res.render('commons/sign-in', { title: 'Signin' });
});

module.exports = router;
