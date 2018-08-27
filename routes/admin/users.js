var express = require('express');
var router = express.Router();

var User = require('../../models/User');

router.all('/list',function(req, res, next){
    var params = [req.body.keyword||'', req.body.role||''];
    var orderby = [req.body.sortField||'updated', req.body.sortOrder||'DESC'];
    User.find(params, orderby, function(err, users){
        if (err) next(err);
        res.render('admin/users/user-list', {
            title:'User list',
            users:users,
            search:{keyword: req.body.keyword, role:req.body.role},
            sort: {field:orderby[0], order:orderby[1]}
        });
    });
});

router.get('/view/:uid',function(req, res, next){
    User.findById(req.params.uid, function(err, users){
        if (err) next(err);
        if(users.length == 0) next(new Error('User date not found!'));
        res.render('admin/users/user-view', {title:'View User', user:users[0] });
    });
});

router.get('/modify/:uid',function(req, res, next){
    User.findById(req.params.uid, function(err, users){
        if (err) next(err);
        if(users.length == 0) next(new Error('User date not found!'));
        res.render('admin/users/user-modify', {title:'Modify User', user:users[0] });
    });
});

router.post('/modify',function(req, res, next){
    User.findById(req.body.uid, function(err, users){
        if (err) next(err);
        if(users.length == 0) next(new Error('User date not found!'));
        var params = [req.body.name, req.body.role, req.body.uid];
        User.update(params, function(uerr, result){
            console.log('updated',result);
            req.flash('info', 'Success!!');
            res.redirect('/admin/users/view/'+req.body.uid);
        });
    });
});
router.post('/remove',function(req, res, next){
    User.findById(req.body.uid, function(err, users){
        if (err) next(err);
        if(users.length == 0) next(new Error('User date not found!'));
        User.remove(req.body.uid, function(uerr, result){
            console.log('deleted',result);
            req.flash('info', 'Delete success!!');
            res.redirect('/admin/users/list');
        });
    });
});
router.get('/add', function(req, res, next){
    res.render('admin/users/user-add', {title:'Add User'});
});
router.post('/add', function(req, res, next){
    var params = [req.body.name, req.body.email, req.body.password, req.body.role];
    console.log('params',params);
    User.findByEmail(req.body.email, function(err, rows){
        if (err) next(err);
        if(rows.length > 0){
            req.flash('warning', 'Duplicated email!!');
            res.redirect('/add');
        }else{
            User.add(params, function(err2, result){
                if (err2) next(err2);
                req.flash('info', 'Insert success!!');
                res.redirect('/admin/users/view/'+result.insertId);
            });
        }
    });
});
module.exports = router;
