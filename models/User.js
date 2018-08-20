var db = require('../dbconn');
var bcrypt = require('bcrypt-nodejs');

var User = {
    add: function(params, callback){
        var sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
        params[2] = bcrypt.hashSync(params[2], bcrypt.genSaltSync(8), null);
        return db.query(sql, params, callback);
    },
    findByEmail: function(email, callback){
        var sql = "SELECT uid, email, password, name, role FROM users WHERE email = ?";
        return db.query(sql, [email], callback);
    },
    findById: function(id, callback){
        var sql = "SELECT uid, email, password, name, role, DATE_FORMAT(updated,'%e/%c/%Y %H:%i') AS updated FROM users WHERE uid = ?";
        return db.query(sql, [id], callback);
    },
    find: function(params, callback){
        var p = [];
        var sql = "SELECT uid, email, password, name, role, DATE_FORMAT(updated,'%e/%c/%Y %H:%i') AS updated FROM users";
        if(params[0] != '' || params[1] != ''){
            sql += " WHERE";
            if(params[0] != ''){
                // case 2
                sql += " ( name LIKE concat('%',?,'%') OR email LIKE concat('%',?,'%') )";
                p.push(params[0]);
                p.push(params[0]);
                if(params[1] != '') sql += " AND"; // case 4
            }
            if(params[1] != ''){ // case 3, 4
                sql += " role = ?";
                p.push(params[1]);
            }
        }
        return db.query(sql, p, callback);
    },
    compare: function(cleartext, encrypted){
        return bcrypt.compareSync(cleartext, encrypted);
    }
};

module.exports = User;
