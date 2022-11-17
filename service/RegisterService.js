const conn = require('../config/db')
const conn2 = require('../config/db2')

exports.doRegister = function(data){

    const param = [data.userId, data.userPW];
    var sql = "INSERT INTO user (uid, upw) VALUES (?, ?);"

    var sql2 = `create table ${data.userId}(con int auto_increment primary key, noodle int, 
                                    rawfish int, soup int, meat int, barger int, 
                                    tteokbokki int, rice int, pizza int, chicken int, salad int);`
    
    
    var sqlinsert1 = `insert into ${data.userId} (noodle, rawfish, soup, meat, barger, tteokbokki, rice, pizza, chicken, salad) 
                                            values (0,0,0,0,0,0,0,0,0,0);`;    //like
    var sqlinsert2 = `insert into ${data.userId} (noodle, rawfish, soup, meat, barger, tteokbokki, rice, pizza, chicken, salad) 
                                            values (-1,-1,-1,-1,-1,-1,-1,-1,-1,-1);`;    //day
    var sqlinsert3 = `insert into ${data.userId} (noodle, rawfish, soup, meat, barger, tteokbokki, rice, pizza, chicken, salad) 
                                            values (0,0,0,0,0,0,0,0,0,0);`;    //count
   
    var consql = sqlinsert1 + sqlinsert2 + sqlinsert3;
    
    conn.query(sql, param, (err, row) => {
        if(err) res.status(400).json({message: err.message})
    });

    conn2.query(sql2 + consql, (err, row) => {
        if(err) res.status(400).json({message: err.message})
    });
    
    return true;
}
