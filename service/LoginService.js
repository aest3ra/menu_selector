const conn = require('../config/db')
const config = require('../config/config')
const jwt = require("jsonwebtoken");

exports.doLogin = function(data){
    const key = config.SECRET_KEY;
    const loginId = data.userId
    const loginPW = data.userPW
    
    param = [loginId];
    var sql = 'SELECT * FROM user WHERE uid = ?';

    conn.query(sql, param, (err, row) => {
        var userID = row[0].uid;
        var userPW = row[0].upw;

        if (loginId === userID && loginPW === userPW) {
            return res.json({
                token: jsonwebtoken.sign({ user: userID }, key),
            });
        }else{
            console.log("비번 틀림");
        }
    });
    
    return true;
}